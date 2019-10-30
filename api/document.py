import json


class Document:
    def __init__(self):
        self.children = dict()

    def save_document(self):
        data = dict()

        for obj in self.children:
            data.append(obj.serialize())

        with open('document.txt', 'w') as outfile:
            json.dump(data, outfile)
