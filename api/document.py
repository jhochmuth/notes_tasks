import json
import uuid

from api.note import Note
from api.connection import Connection


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
