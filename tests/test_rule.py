from api.container import Container
from api.note import Note
from api.rule import Rule


def test_rule():
    note = Note("Joseph Conrad",
                "Modernist author.",
                attrs={"birth": 1857,
                       "death": 1924,
                       "nationality": "British-Polish",
                       "novels": ["Nostromo", "The Secret Agent"]
                       },
                )

    container = Container(notes=[note])

    rule = Rule(target="title",
                add_text="Author - ",
                effect_location="prepend"
                )

    container.add_rule(rule)

    assert note.attrs["title"] == "Author - Joseph Conrad"
