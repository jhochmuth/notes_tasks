import json

import os

import pypandoc

import uuid

from api.note import Note
from api.connection import Connection
from utils.gdrive_authentication import gdrive
from utils.onedrive_authentication import client


def prepare_string_for_gdrive(string):
    return string.replace(" ", "%20").replace("#", "%23").replace(":", "%3A")


def prepare_string_from_gdrive(string):
    return string.replace("%20", " ").replace("%23", "#").replace("%3A", ":")


def prepare_dict_for_gdrive(d):
    new_dict = dict()

    for key, val in d.items():
        new_key = prepare_string_for_gdrive(key)
        new_dict[new_key] = prepare_string_for_gdrive(val)

    return new_dict


def prepare_dict_from_gdrive(d):
    new_dict = dict()

    for key, val in d.items():
        new_key = prepare_string_from_gdrive(key)
        new_dict[new_key] = prepare_string_from_gdrive(val)

    return new_dict


class Document:
    def __init__(self):
        self.children = dict()
        self.drive_id_mappings = dict()
        self.id = str(uuid.uuid1())

    def save_document(self, filename):
        data = dict()
        data["backend"] = dict()

        for id, obj in self.children.items():
            data["backend"][obj.id] = obj.serialize()

        with open(filename, 'w') as outfile:
            json.dump(data, outfile)

    @classmethod
    def load_document(cls, file):
        document = cls()

        with open(file, 'r') as infile:
            data = json.load(infile)
            for id, obj in data["backend"].items():
                if obj["type"] == "note":
                    note = Note.from_dict(obj)
                    document.children[note.id] = note
                elif obj["type"] == "connection":
                    connection = Connection.from_dict(obj)
                    document.children[connection.id] = connection

        return document

    def create_notes_from_onedrive_folder(self, item_id):
        # todo: change to yield notes
        collection = client.item(drive="me", id=item_id).children.request().get()

        new_notes = dict()

        for item in collection:
            if item.id in self.children:
                note = self.children[item.id]
                if note.attrs["title"] != item.name:
                    note.update_title(item.name)

            else:
                attrs = dict()
                attrs["Date created"] = item.created_date_time
                attrs["OneDrive parent id"] = item_id
                attrs["OneDrive id"] = item.id
                attrs["Drive link"] = item.web_url
                attrs["Source"] = "OneDrive"
                id = item.id.replace("!", "")

                new_notes[item.id] = Note(id=id, title=item.name, text="", attrs=attrs)
                self.children.update(new_notes)

        return new_notes

    def create_notes_from_gdrive(self, id=None):
        if id:
            response = gdrive.files().get(fileId=id, fields="*").execute()
            response = {'files': [response]}
        else:
            response = gdrive.files().list(corpora="user", fields='*', q='trashed=false').execute()

        for file in response['files']:
            if file['id'] in self.drive_id_mappings:
                note = self.children[self.drive_id_mappings[file['id']]]
                note.update_title(file['name'])
            else:
                attrs = dict()
                attrs['Drive link'] = file['webViewLink']
                attrs['Drive id'] = file['id']
                attrs['Source'] = "Google Drive"
                if 'appProperties' in file:
                    attrs.update(prepare_dict_from_gdrive(file['appProperties']))

                text = ""
                if attrs['Source'] == "manual":
                    text_data = gdrive.files().get_media(fileId=file['id']).execute()
                    text = pypandoc.convert_text(text_data, 'html', format='odt')

                note = Note(id=file["id"],
                            title=file["name"],
                            text=text,
                            attrs=attrs)
                self.children[note.id] = note

            yield note

    def upload_notes_to_drive(self, drive):
        # todo: handle case where item deleted in gdrive or locally
        # todo: handle changes with associated file - if 'drive link' in attrs but path changed
        for item in self.children.values():
            if isinstance(item, Note):
                if "Drive link" not in item.attrs:
                    name = item.attrs["title"]

                    if "path" in item.attrs:
                        path = item.attrs["path"]

                        _, ext_in_title = os.path.splitext(item.attrs['title'])

                        if not ext_in_title:
                            filename, file_extension = os.path.splitext(item.attrs["path"])
                            name += file_extension
                    else:
                        pypandoc.convert_text(item.attrs['text'], 'odt', format='html', outputfile='./temp.odt')
                        path = './temp.odt'
                        if name[-4:] != ".odt":
                            name += ".odt"

                    if drive == "onedrive":
                        parent = "root"
                        if "OneDrive parent id" in item.attrs:
                            parent = item.attrs["OneDrive parent id"]

                        response = client.item(drive="me", id=parent).children[name].upload(path)
                        item.attrs["Drive link"] = response.web_url
                        yield item

                    elif drive == "gdrive":
                        attrs = prepare_dict_for_gdrive(item.attrs)

                        file_metadata = {'name': name,
                                         'appProperties': attrs}

                        response = gdrive.files().create(media_body=path, body=file_metadata, fields="*").execute()
                        item.attrs["Drive link"] = response["webViewLink"]
                        item.attrs["Drive id"] = response["id"]
                        self.drive_id_mappings[response["id"]] = item.id
                        os.remove("./temp.odt")
                        yield item

                else:
                    # todo: handle files that user does not have permission to access/modify
                    if drive == "gdrive":
                        file_metadata = {'appProperties': prepare_dict_for_gdrive(item.attrs)}

                        response = gdrive.files().update(fileId=item.attrs['Drive id'], body=file_metadata).execute()

    def sync_with_drive(self, drive, methods=['upload', 'download']):
        if drive == "gdrive":
            if 'upload' in methods:
                yield from self.upload_notes_to_drive(drive)
            if 'download' in methods:
                yield from self.create_notes_from_gdrive()

        elif drive == 'onedrive':
            if 'upload' in methods:
                yield from self.upload_notes_to_drive(drive)
            if 'download' in methods:
                yield from self.create_notes_from_onedrive_folder("root")
