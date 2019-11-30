import json

from api.note import Note


class Document:
    def __init__(self):
        self.children = dict()

    def save_document(self):
        data = dict()

        for id, obj in self.children.items():
            data[obj.id] = (obj.serialize())

        with open('document.txt', 'w') as outfile:
            json.dump(data, outfile)

    def load_document(self):
        self.children = dict()

        with open('document.txt', 'r') as infile:
            data = json.load(infile)
            for id, obj in data.items():
                if obj["type"] == "note":
                    note = Note.from_dict(obj)
                    self.children[note.id] = note
