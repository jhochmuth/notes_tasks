default_container = dict()
default_search_order = tuple()


class Container:
    def __init__(self, id=None, attrs=default_container, notes=None, data=None):
        self.id = id

        if attrs is None:
            self.attrs = default_container
        else:
            self.attrs = attrs

        if notes is None:
            self.notes = list()
        else:
            self.notes = list(notes)

        if data is None:
            self.data = dict()
        else:
            self.data = data

        self.rules = list()

    def search_child_note_attrs(self, condition, attrs=None):
        """Search child note attributes for a specified condition."""
        results = list()

        for note in self.notes:
            if note.search_attrs(condition, attrs):
                results.append(note)

        return results

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

    def serialize(self):
        data = dict()
        data["id"] = self.id
        data["type"] = "container"
        data["attrs"] = self.attrs
        data["notes"] = [note.id for note in self.notes]

    @classmethod
    def from_dict(cls, data):
        return cls(data["id"],
                   data["attrs"],
                   data["notes"])

    def __str__(self):
        string = "Container contents:\n"
        for note in self.notes:
            string += "\t"
            string += note.__str__()
            string += "\n"
        return string


def note_ordering(notes, search_order=default_search_order):
    return sorted(notes, key=search_order)
