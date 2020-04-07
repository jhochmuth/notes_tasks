from api.note import Note


def test_note_deserialization():
    data = dict()
    attrs = {"title": "Conrad", "text": "Author"}
    data["id"] = "a"
    data["attrs"] = attrs
    data["parent_container"] = None
    data["prototype"] = None
    data["inherited_attrs"] = list()

    note = Note.from_dict(data)

    assert note.attrs["title"] == "Conrad" and note.attrs["text"] == "Author"
