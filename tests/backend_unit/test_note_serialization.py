from api.note import Note


def test_note_serialization():
    note1 = Note("Joseph Conrad",
                 "Modernist author.",
                 attrs={"birth": "1857",
                        "death": "1924",
                        "nationality": "British-Polish",
                        "novels": ["Nostromo", "The Secret Agent"]
                        },
                 )

    data = note1.serialize()

    assert (data["attrs"]["title"] == "Joseph Conrad"
            and data["type"] == "note")
