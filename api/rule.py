from api.uid import UID


class Rule:
    def __init__(self, target, add_text, effect_location=None):
        self.id = UID().assign_uid()
        self.target = target
        self.add_text = add_text
        self.effect_location = effect_location

    def apply(self, note):
        if self.effect_location == "prepend":
            note.attrs[self.target] = self.add_text + note.attrs[self.target]
        elif self.effect_location == "append":
            note.attrs[self.target] += self.add_text
        else:
            del note.attrs[self.target]
