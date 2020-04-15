import pytest

from api.note import Note


pytest.main()


def test_prototype():
    prototype = Note("Joseph Conrad",
                     "",
                     id="1",
                     attrs={"occupation": "novelist",
                            "nationality": "British-Polish"
                            },
                     )

    descendant = prototype.create_descendant("2")
    descendant.update_title("Charles Dickens")
    descendant.inherited_attrs.remove("nationality")

    last_descendant = descendant.create_descendant("3")
    last_descendant.update_title("George Eliot")

    for _ in descendant.update_attr("nationality", "British"):
        pass

    for _ in prototype.update_attr("occupation", "author"):
        pass

    assert prototype.attrs["occupation"] == descendant.attrs["occupation"]
    assert prototype.attrs["nationality"] != descendant.attrs["nationality"]
    assert prototype.attrs["occupation"] == last_descendant.attrs["occupation"]
    assert descendant.attrs["nationality"] == last_descendant.attrs["nationality"]
