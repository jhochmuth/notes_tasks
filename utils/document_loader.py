import json

from api.container import Container
from api.document import Document
from api.old_note import Note


def load_document(filename):
    with open(filename, 'r') as infile:
        data = json.load(infile)

    document = Document()

    for e in data:
        if e["type"] == "note":
            document.append(Note.from_dict())
        elif e["type"] == "container":
            document.append(Container.from_dict())
