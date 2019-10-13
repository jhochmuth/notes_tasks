import logging

from api.conditional import NumberConditional, StringConditional
from api.connection import Connection
from api.container import Container
from api.note import Note
from api.rule import Rule
from api.task import Task

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def main():
    """TODO: Add click."""
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

    note3 = Note("Edith Wharton",
                 "Female American author.",
                 attrs={"birth": 1862,
                        "death": 1937,
                        "nationality": "American",
                        "novels": ["The House of Mirth"]
                        },
                 tags=["primary"]
                 )

    connection = Connection(note1, note2)

    container = Container(notes=[note1, note2])
    logger.debug(container)

    rule1 = Rule(target_type="title",
                 effect="Author - ",
                 effect_location="prepend"
                 )

    container.add_rule(rule1)
    logger.debug(container)

    container.add_note(note3)
    logger.debug(container)

    condition = NumberConditional(target=1900, condition="gt")
    logger.debug(container.search_child_note_attrs(condition, attrs=["death"]))

    condition = StringConditional(target="British", condition="!contains")
    logger.debug(container.search_child_note_attrs(condition, attrs=["nationality"]))

    task = Task()
    location_attrs = {"class": "textpart"}
    data = task.web_scrape("http://totallyhistory.com/biography/famous-authors/", "td", location_attrs)
    indices_dict = {"title": [0], "text": [10], "attrs": {"nationality": [5], "birth": [1]}}
    new_notes = task.create_notes_from_web_data(data, indices_dict)
    for note in new_notes:
        container.add_note(note)
    for note in container.notes:
        logger.debug(note.__repr__())
        logger.debug("\n-------\n")


if __name__ == "__main__":
    main()
