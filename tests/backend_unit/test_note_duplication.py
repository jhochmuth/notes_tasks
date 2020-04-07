from api.note import Note


def test_note_duplication():
    note1 = Note("Joseph Conrad",
                 "Modernist author.",
                 attrs={"birth": "1857",
                        "death": "1924",
                        "nationality": "British-Polish",
                        "novels": ["Nostromo", "The Secret Agent"]
                        },
                 )

    note2 = note1.create_duplicate()

    assert note1.attrs["title"] == note2.attrs["title"] and note1.attrs["text"] == note2.attrs["text"]
