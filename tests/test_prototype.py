import pytest

from api.old_note import Note


pytest.main()


def test_prototype():
    prototype = Note("Joseph Conrad",
                     "Modernist author.",
                     attrs={"birth": 1857,
                            "death": 1924,
                            "nationality": "British-Polish",
                            "novels": ["Nostromo", "The Secret Agent"]
                            },
                     tags=["primary"]
                     )

    inherited_attrs = {"title", "birth"}
    descendant = prototype.create_descendant(inherited_attrs=inherited_attrs)

    prototype.update_attr("death", 0)
    prototype.update_title("blah")
    prototype.update_attr("birth", 10)

    assert prototype.attributes["death"] != descendant.attributes["death"]
    assert prototype.attributes["birth"] == descendant.attributes["birth"]
    assert prototype.title == descendant.title
