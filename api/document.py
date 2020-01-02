import json
import uuid

from api.note import Note
from api.connection import Connection


class Document:
    def __init__(self):
        self.children = dict()
        #self.id = str(uuid.uiid1())
        self.id = "0"

    def save_document(self, filename):
        data = dict()
        data["backend"] = dict()

        for id, obj in self.children.items():
            data["backend"][obj.id] = obj.serialize()

        with open(filename, 'w') as outfile:
            json.dump(data, outfile)

    def load_document(self, file):
        self.children = dict()

        with open(file, 'r') as infile:
            data = json.load(infile)
            for id, obj in data["backend"].items():
                if obj["type"] == "note":
                    note = Note.from_dict(obj)
                    self.children[note.id] = note
                elif obj["type"] == "connection":
                    connection = Connection.from_dict(obj)
                    self.children[connection.id] = connection
