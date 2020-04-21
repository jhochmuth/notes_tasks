from api.note import Note
from api.uid import UID


class Archetype:
    def __init__(self, name, id=None, attrs=None):
        if not id:
            self.id = UID().assign_uid()
        else:
            self.id = id

        self.name = name

        if self.attrs:
            self.attrs = attrs;
        else:
            self.attrs = dict()

        self.descendant_notes = list()

    def create_inheritor(self, id):
        note = Note(id=id,
                    title="(Not specified)",
                    text="",
                    attrs=self.attrs,
                    prototype=self,
                    inherited_attrs=set(self.attrs.keys()))

        self.descendant_notes.append(note)
        return note

    def update_attr(self, attr, val):
        self.attrs[attr] = val

        for descendant in self.descendant_notes:
            descendant.update_attr_archetype(attr, val)
            yield descendant

    def delete_attr(self, attr):
        del self.attrs[attr]

        for descendant in self.descendant_notes:
            descendant.delete_attr_archetype(attr)
