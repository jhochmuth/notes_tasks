from datetime import datetime

from api.uid import UID


default_note = dict()


# TODO: Fix functionality for dates when using GRPC.
class Note:
    """Basic note class."""
    def __init__(self,
                 title,
                 text,
                 attrs=None,
                 parent_container=None,
                 prototype=None,
                 inherited_attrs=None):
        """Note constructor.

        Parameters
        ----------
        title : str
            The title of the note.
        text : str
            The text of the note.
        attrs : dict, optional
            A dictionary containing key-value pairs of attributes.
        parent_container : Container, optional
            The parent container holding this note.
        prototype : Note, optional
            The prototype for this note.
        inherited_attrs : set, optional
            Any attribute specified in this set will be inherited from the prototype.

        """
        self.id = UID().assign_uid()

        if attrs is None:
            self.attrs = dict()
        else:
            self.attrs = attrs

        self.attrs["title"] = title
        self.attrs["text"] = text

        self.attrs["date_created"] = datetime.utcnow().strftime("%Y/%m/%d %I:%M %p")
        self.update_last_changed()

        self.attrs["text_char_len"] = str(len(self.attrs["text"]))
        self.attrs["text_word_len"] = str(len(self.attrs["text"].split()))

        self.connections = list()

        self.parent_container = parent_container

        self.prototype = prototype

        if inherited_attrs is None:
            self.inherited_attrs = set()
        else:
            self.inherited_attrs = inherited_attrs

        self.descendant_notes = list()

        self.search_priority = None

    def update_last_changed(self):
        self.attrs["last_changed"] = datetime.utcnow().strftime("%Y/%m/%d %I:%M %p")

    def update_text(self, new_text):
        """Used to update the text of a note."""
        if new_text != self.attrs["text"]:
            self.attrs["text"] = new_text
            self.attrs["last_changed"] = datetime.utcnow()
            self.attrs["text_char_len"] = len(self.text)
            self.attrs["text_word_len"] = len(self.text.split())

            for descendant in self.descendant_notes:
                if "text" in descendant.inherited_attrs:
                    descendant.update_text(new_text)

    def update_title(self, new_title):
        """Changes the title of a note."""
        if new_title != self.attrs["title"]:
            self.attrs["title"] = new_title
            self.attrs["last_changed"] = datetime.utcnow()

            for descendant in self.descendant_notes:
                if "title" in descendant.inherited_attrs:
                    descendant.update_title(new_title)

    def remove_attrs(self, attrs):
        self.attrs["last_changed"] = datetime.utcnow()

        for attr in attrs:
            del self.attribute[attr]

        for descendant in self.descendant_notes:
            for attr in attrs:
                if attr in descendant.inherited_attrs:
                    descendant.remove_attrs()

    def add_attr(self, attr, value, prototypal=False):
        self.attrs["last_changed"] = datetime.utcnow()
        self.attrs[attr] = value

        if prototypal:
            for descendant in self.descendant_notes:
                descendant.inherited_attrs.add(attr)
                descendant.add_attr(attr, value, True)

    def update_attr(self, attr, value):
        self.update_last_changed()
        self.attrs[attr] = value

        for descendant in self.descendant_notes:
            if attr in descendant.inherited_attrs:
                descendant.update_attr(attr, value)

    def create_duplicate(self):
        """Copies a note without creating an inheritance link."""
        new = Note(title=self.attrs["title"],
                   text=self.attrs["text"],
                   attrs=self.attrs.copy(),
                   parent_container=self.parent_container)
        new.attrs["date_created"] = datetime.utcnow()
        new.attrs["last_changed"] = datetime.utcnow()

        return new

    def create_descendant(self, inherited_attrs):
        """Creates a descendant note using prototypal inheritance."""
        new = Note(title=self.attrs["title"],
                   text=self.attrs["text"],
                   attrs=self.attrs.copy(),
                   prototype=self,
                   inherited_attrs=inherited_attrs,
                   parent_container=self.parent_container)

        new.attrs["date_created"] = datetime.utcnow()
        new.attrs["last_changed"] = datetime.utcnow()

        self.descendant_notes.append(new)

        return new

    def get_container_data(self):
        """Accesses parent container data."""
        if self.parent_container:
            return self.parent_container.data
        else:
            return None

    def search_attrs(self, condition, attrs=None):
        """Method used when searching the attributes of a note.

        Parameters
        ----------
        condition : Conditional
            The condition to be fulfilled. Each attribute will be checked individually.
        attrs : list, optional
            Contains the attributes that should be searched. If none given, then all attributes will be checked.

        Returns
        -------
        bool

        """
        if attrs is None:
            for _, val in self.attrs.items():
                if condition(val):
                    return True

        else:
            for attr in attrs:
                if condition(self.attrs[attr]):
                    return True

        return False

    def has_attr(self, attr):
        """Checks for the existence of an attribute in this note."""
        return attr in self.attrs

    def serialize(self):
        data = dict()
        data["id"] = self.id
        data["type"] = "note"
        data["attrs"] = self.attrs
        data["parent_container"] = self.parent_container.id
        data["prototype"] = self.prototype.id
        data["inherited_attrs"] = self.inherited_attrs
        return data

    @classmethod
    def from_dict(cls, data):
        return cls(id=data["id"],
                   title=data["attrs"]["title"],
                   text=data["attrs"]["text"],
                   attrs=data["attrs"],
                   parent_container=data["parent_container"],
                   prototype=data["prototype"],
                   inherited_attrs=data["inherited_attrs"])

    def __str__(self):
        return self.attrs["title"]

    def __repr__(self):
        for key, val in self.attrs.items():
            repr += "{}: {}\n".format(key, val)
        return repr


class URL:
    def __init__(self, address):
        self.address_location = address

    @property
    def address(self):
        return self.address_location
