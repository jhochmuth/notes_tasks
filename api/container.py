default_container = dict()
default_search_order = tuple()


class Container:
    def __init__(self, settings=default_container, notes=None, data=None):
        self.settings = settings

        if notes is None:
            self.notes = list()
        else:
            self.notes = notes

        if data is None:
            self.data = dict()
        else:
            self.data = data

        self.rules = list()

    def search_child_note_attrs(self, condition, attrs=None):
        """Search child note attributes for a specified condition."""
        contains = list()

        for note in self.notes:
            if note.search_attrs(condition, attrs):
                contains.append(note)

        return contains

    def search_child_note_texts(self, condition):
        """Search all child note texts for a specified query."""
        contains = list()

        for note in self.notes:
            if note.search_text(condition):
                contains.append(note)

        return contains

    def search_child_note_tags(self, condition):
        """Search all child note tags for a specified query."""
        contains = list()

        for note in self.notes:
            if note.search_tags(condition):
                contains.append(note)

        return contains

    def add_note(self, new_note):
        """Add a note to this container."""
        for rule in self.rules:
            rule.apply(new_note)
        self.notes.append(new_note)

    def add_rule(self, new_rule):
        """Add a rule to this container that all child notes must adhere to."""
        for note in self.notes:
            new_rule.apply(note)
        self.rules.append(new_rule)

    def __str__(self):
        string = "Container contents:\n"
        for note in self.notes:
            string += "\t"
            string += note.__str__()
            string += "\n"
        return string


def note_ordering(notes, search_order=default_search_order):
    return sorted(notes, key=search_order)
