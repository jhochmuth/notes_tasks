from api.conditional import NumberConditional
from api.container import Container
from api.old_note import Note


def test_search_text():
    note1 = Note("Joseph Conrad",
                 "Modernist author.",
                 attrs={"birth": 1857,
                        "death": 1924,
                        "nationality": "British-Polish",
                        "novels": ["Nostromo", "The Secret Agent"]
                        },
                 tags=["primary"]
                 )

    note2 = Note("Charles Dickens",
                 "Famous Victorian author.",
                 attrs={"birth": 1812,
                        "death": 1870,
                        "nationality": "British",
                        "novels": ["Great Expectations"]
                        },
                 tags=["primary"]
                 )

    container = Container(notes=[note1, note2])

    condition = NumberConditional(target=1850, condition="lt")

    query = container.search_child_note_attrs(condition, attrs=["birth"])

    assert len(query) == 1
