import json

from api.conditional import NumberConditional, StringConditional
from api.connection import Connection
from api.container import Container
from api.document import Document
from api.old_note import Note


def load_document(filename):
    with open(filename, 'r') as infile:
        data = json.load(infile)

    document = Document()

    for obj in data:
        if obj["type"] == "note":
            document.append(Note.from_dict())
        elif obj["type"] == "container":
            document.append(Container.from_dict())
        elif obj["type"] == "connection":
            document.append(Connection.from_dict())
        elif obj["type"] == "string_conditional":
            document.append(StringConditional.from_dict())
        elif obj["type"] == "number_conditional":
            document.append(NumberConditional.from_dict())
