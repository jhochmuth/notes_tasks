from datetime import datetime

import onedrivesdk_fork as onedrivesdk

import os

import PyPDF2

from uuid import uuid1


RESERVED_ATTRS = {"title",
                  "text",
                  "Date created",
                  "Last changed",
                  "Text char len",
                  "Text word len"}


def get_current_time():
    return datetime.now().strftime("%Y/%m/%d %I:%M %p")


# TODO: Fix functionality for dates when using GRPC.
class Note:
    """Basic note class."""
    def __init__(self,
                 title,
                 text,
                 id=None,
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
            Specifies attrs inherited from prototype.

        """
        if not id:
            self.id = str(uuid1())
        else:
            self.id = id

        if attrs is None:
            self.attrs = dict()
        else:
            self.attrs = attrs

        self.attrs["title"] = title
        self.attrs["text"] = text

        if "Date created" in self.attrs:
            if type(self.attrs["Date created"]) != str:
                self.attrs["Date created"] = self.attrs["Date created"].strftime("%Y/%m/%d %I:%M %p")
        else:
            self.attrs["Date created"] = get_current_time()

        self.update_last_changed()

        self.attrs["Text char len"] = str(len(self.attrs["text"]))
        self.attrs["Text word len"] = str(len(self.attrs["text"].split()))

        self.attrs["Color"] = attrs["Color"] if "Color" in self.attrs else "#686868"

        self.attrs["Source"] = attrs["Source"] if "Source" in self.attrs else "Manual"

        self.connections = list()

        self.parent_container = parent_container
        self.prototype = prototype

        if inherited_attrs is None:
            self.inherited_attrs = set()
        else:
            self.inherited_attrs = inherited_attrs

        self.descendant_notes = list()

        self.search_priority = None
        """
        for key, val in default_note_settings.items():
            if key not in self.attrs:
                self.attrs[key] = val
        """
    def update_last_changed(self):
        self.attrs["Last changed"] = get_current_time()

    def update_text(self, new_text):
        """Used to update the text of a note."""
        if new_text != self.attrs["text"]:
            self.attrs["text"] = new_text
            self.update_last_changed()
            self.attrs["Text char len"] = str(len(self.attrs["text"]))
            self.attrs["Text word len"] = str(len(self.attrs["text"].split()))

    def update_title(self, new_title):
        """Changes the title of a note."""
        if new_title != self.attrs["title"]:
            self.attrs["title"] = new_title
            self.update_last_changed()

            for descendant in self.descendant_notes:
                if "title" in descendant.inherited_attrs:
                    descendant.update_title(new_title)

    def delete_attr(self, attr):
        self.update_last_changed()

        if attr in self.inherited_attrs:
            self.inherited_attrs.remove(attr)

        del self.attrs[attr]

        for descendant in self.descendant_notes:
            if attr in descendant.inherited_attrs:
                descendant.delete_attr(attr)

    def add_attr(self, attr, value, prototypal=False):
        self.update_last_changed()
        self.attrs[attr] = value

        if prototypal:
            for descendant in self.descendant_notes:
                descendant.inherited_attrs.add(attr)
                descendant.add_attr(attr, value, True)

    def update_attr(self, attr, value, descendant=False):
        if attr == "text":
            self.update_text(value)
        else:
            if not descendant and attr in self.inherited_attrs:
                self.inherited_attrs.remove(attr)
            self.update_last_changed()
            self.attrs[attr] = value

        for descendant in self.descendant_notes:
            if attr in descendant.inherited_attrs:
                yield from descendant.update_attr(attr, value, True)

        yield self

    # todo: update to allow for optional creation of new attr in existing inheritors if new attr added to archetype
    def update_attr_archetype(self, attr, val):
        if attr in self.inherited_attrs or attr not in self.attrs:
            self.attrs[attr] = val
            self.inherited_attrs.add(attr)

        self.update_last_changed()

    def delete_attr_archetype(self, attr):
        if attr in self.inherited_attrs:
            del self.attrs[attr]

        self.update_last_changed

    def create_duplicate(self):
        """Copies a note without creating an inheritance link."""
        new = Note(title=self.attrs["title"],
                   text=self.attrs["text"],
                   attrs=self.attrs.copy(),
                   parent_container=self.parent_container)
        new.attrs["Date created"] = datetime.now()
        new.attrs["Last changed"] = datetime.now()

        return new

    def create_descendant(self, descendant_id):
        """Creates a descendant note using prototypal inheritance."""
        new = Note(title=self.attrs["title"],
                   text=self.attrs["text"],
                   id=descendant_id,
                   attrs=self.attrs.copy(),
                   prototype=self,
                   inherited_attrs=set(self.attrs.keys()),
                   parent_container=self.parent_container)

        new.inherited_attrs -= RESERVED_ATTRS

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
            The condition to test for.
        attrs : list, optional
            Contains the attributes that should be searched.
            If none given, then all attributes will be checked.

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
        data["parent_container"] = (self.parent_container.id
                                    if self.parent_container else None)
        data["prototype"] = self.prototype.id if self.prototype else None
        data["inherited_attrs"] = list(self.inherited_attrs)
        return data

    def prepare_deletion(self):
        if self.parent_container:
            self.parent_container.remove_note(self)

        for descendant in self.descendant_notes:
            descendant.prototype = None

        if self.prototype:
            self.prototype.descendant_notes.remove(self)

        return self.descendant_notes

    @classmethod
    def from_dict(cls, data):
        return cls(id=data["id"],
                   title=data["attrs"]["title"],
                   text=data["attrs"]["text"],
                   attrs=data["attrs"],
                   parent_container=data["parent_container"],
                   prototype=data["prototype"],
                   inherited_attrs=set(data["inherited_attrs"]))

    @classmethod
    def from_file(cls, path, id=None):
        filepath, filename = os.path.split(path)
        name, file_extension = os.path.splitext(filename)

        try:
            if file_extension == ".pdf":
                reader = PyPDF2.PdfFileReader(path)
                file_info = PyPDF2.PdfFileReader(path).getDocumentInfo()
                title = file_info.title.replace(".pdf", "") or name
                author = file_info.author or "could not extract"
                pages = reader.getNumPages()
                attrs = {"author": author, "pages": str(pages), "path": path}

                return cls(id=id, title=title, text="", attrs=attrs)

            elif file_extension == ".txt":
                with open(path, 'r') as f:
                    text = f.read()
                    return cls(id=id, title=name, text=text)

            else:
                return cls(id=id, title=name)

        except:
            return

    def __str__(self):
        return self.attrs["title"]

    def __repr__(self):
        repr = ""
        for key, val in self.attrs.items():
            repr += "{}: {}\n".format(key, val)
        return repr


class URL:
    def __init__(self, address):
        self.address_location = address

    @property
    def address(self):
        return self.address_location
