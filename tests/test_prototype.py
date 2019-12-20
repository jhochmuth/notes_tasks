import pytest

from api.note import Note


pytest.main()


def test_prototype():
    prototype = Note("Joseph Conrad",
                     "Modernist author.",
                     attrs={"birth": "1857",
                            "death": "1924",
                            "nationality": "British-Polish",
                            "novels": ["Nostromo", "The Secret Agent"]
                            },
                     )

    inherited_attrs = {"title", "birth"}
    descendant = prototype.create_descendant(inherited_attrs=inherited_attrs)

    prototype.update_attr("death", "0")
    prototype.update_title("blah")
    prototype.update_attr("birth", "10")

    assert prototype.attrs["death"] != descendant.attrs["death"]
    assert prototype.attrs["birth"] == descendant.attrs["birth"]
    assert prototype.attrs["title"] == descendant.attrs["title"]
