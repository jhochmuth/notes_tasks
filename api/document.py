from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

import json

import os

import uuid

from api.note import Note
from api.connection import Connection
from utils.gdrive_authentication import gdrive
from utils.onedrive_authentication import client


def prepare_string_for_gdrive(string):
    return string.replace(" ", "%20").replace("#", "%23").replace(":", "%3A")


class Document:
    def __init__(self):
        self.children = dict()
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
                attrs["drive_link"] = item.web_url
                attrs["source"] = "OneDrive"
                id = item.id.replace("!", "")

                new_notes[item.id] = Note(id=id, title=item.name, text="", attrs=attrs)
                self.children.update(new_notes)

        return new_notes

    def create_notes_from_gdrive(self):
        #todo: method also creates notes from trashed files
        response = gdrive.files().list(corpus="user", fields='*').execute()

        for file in response['files']:
            if file['id'] in self.children:
                note = self.children[file['id']]
                note.update_title(file['name'])
            else:
                attrs = dict()
                attrs['drive_link'] = file['webViewLink']
                attrs['source'] = "Google Drive"
                note = Note(id=file["id"],
                            title=file["name"],
                            text="",
                            attrs=attrs)
                self.children[note.id] = note
            yield note

    def upload_notes_to_drive(self, drive):
        for item in self.children.values():
            if isinstance(item, Note):

                # todo: remove this and handle case where no path provided
                if "path" not in item.attrs:
                    pass

                # todo: handle update case for items already uploaded
                if "drive_link" not in item.attrs:
                    name = item.attrs["title"]
                    if "extension" in item.attrs:
                        name += item.attrs["extension"]
                    else:
                        filename, file_extension = os.path.splitext(item.attrs["path"])
                        name += file_extension

                    if "path" in item.attrs:
                        path = item.attrs["path"]
                    else:
                        #Create txt file from text, upload, and delete file
                        path = ""

                    if drive == "onedrive":
                        parent = "root"
                        if "OneDrive parent id" in item.attrs:
                            parent = item.attrs["OneDrive parent id"]

                        response = client.item(drive="me", id=parent).children[name].upload(path)
                        item.attrs["drive_link"] = response.web_url
                        yield item

                    elif drive == "gdrive":
                        attrs = dict()
                        for key, val in item.attrs.items():
                            new_key = prepare_string_for_gdrive(key)
                            attrs[new_key] = prepare_string_for_gdrive(val)

                        file_metadata = {'name': name,
                                         'appProperties': attrs}

                        response = gdrive.files().create(media_body=path, body=file_metadata, fields="*").execute()
                        item.attrs["drive_link"] = response["webViewLink"]
                        yield item

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
