from api.conditional import StringConditional
from api.container import Container
from api.note import Note


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

    condition = StringConditional(target="Victorian", condition="contains")

    query = container.search_child_note_texts(condition)

    assert len(query) == 1
