import json
import uuid

from api.note import Note
from api.connection import Connection
from utils.onedrive_authentication import client


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

    def create_notes_from_drive_folder(self, item_id):
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
                attrs["link"] = item.web_url
                id = item.id.replace("!", "")

                new_notes[item.id] = Note(id=id, title=item.name, text="", attrs=attrs)
                self.children.update(new_notes)

        return new_notes

    def update_drive_folder(self, ):
        pass
