from api.note import Note


def test_note_creation():
    note1 = Note("Joseph Conrad",
                 "Modernist author.",
                 attrs={"birth": "1857",
                        "death": "1924",
                        "nationality": "British-Polish",
                        "novels": ["Nostromo", "The Secret Agent"]
                        },
                 )

    assert note1.attrs["title"] == "Joseph Conrad" and note1.attrs["birth"] == "1857"
