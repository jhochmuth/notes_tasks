class Rule:
    """TODO: Register class existence with metaclasses.
    __init_subclass__"""
    def __init__(self, target_type, effect, specific_target=None, effect_location=None):
        self.target = target_type
        self.effect = effect
        self.specific_target = specific_target
        self.effect_location = effect_location

    def apply(self, note):
        if self.target == "title":
            if self.effect_location == "prepend":
                note.title = self.effect + note.title
            elif self.effectlocation == "append":
                note.title += self.effect

        elif self.target == "text":
            if self.effect_location == "prepend":
                note.text = self.effect + note.title
            elif self.effectlocation == "append":
                note.text += self.effect

        elif self.target == "tags":
            if self.effect == "$delete":
                note.tags.remove(self.specific_target)

        elif self.target == "attrs":
            if self.effect == "$delete":
                del note.attributes[self.specific_target]
            else:
                note.attributes[self.specific_target] = self.effect

        else:
            if self.effect == "$delete":
                del note.settings[self.specific_target]
            else:
                note.settings[self.specific_target] = self.effect
