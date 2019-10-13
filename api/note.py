from datetime import datetime


default_note = dict()


class Note:
    """Basic note class."""
    def __init__(self,
                 title,
                 text,
                 settings=default_note,
                 attrs=None,
                 tags=None,
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
        settings : dict, optional
            A dictionary specifying settings for this note. Default note settings are used if not specified.
        attrs : dict, optional
            A dictionary containing key-value pairs of attributes.
        tags : set, optional
            A set containing tags for this note.
        parent_container : Container, optional
            The parent container holding this note.
        prototype : Note, optional
            The note prototype for this note.
        prototype_settings : set, optional
            Any attribute specified in this set will be inherited from the prototype.

        """
        self.title = title
        self.text = text

        self.settings = settings

        if attrs is None:
            self.attributes = dict()
        else:
            self.attributes = attrs

        self.attributes["date_created"] = datetime.utcnow()
        self.attributes["last_changed"] = datetime.utcnow()
        self.attributes["text_char_len"] = len(self.text)
        self.attributes["text_word_len"] = len(self.text.split())

        if tags is None:
            self.tags = set()
        else:
            self.tags = tags

        self.connections = list()

        self.parent_container = parent_container

        self.prototype = prototype

        if inherited_attrs is None:
            self.inherited_attrs = set()
        else:
            self.inherited_attrs = inherited_attrs

        self.descendant_notes = list()

        self.search_priority = None

    def update_text(self, new_text):
        """Used to update the text of a note."""
        if new_text != self.text:
            self.text = new_text
            self.attributes["last_changed"] = datetime.utcnow()
            self.attributes["text_char_len"] = len(self.text)
            self.attributes["text_word_len"] = len(self.text.split())

            for descendant in self.descendant_notes:
                if "text" in descendant.inherited_attrs:
                    descendant.update_text(new_text)

    def update_title(self, new_title):
        """Changes the title of a note."""
        if new_title != self.title:
            self.title = new_title
            self.attributes["last_changed"] = datetime.utcnow()

            for descendant in self.descendant_notes:
                if "title" in descendant.inherited_attrs:
                    descendant.update_title(new_title)

    def remove_tags(self, tags):
        self.attributes["last_changed"] = datetime.utcnow()

        for tag in tags:
            self.tags.remove(tag)

        for descendant in self.descendant_notes:
            if "tags" in descendant.inherited_attrs:
                descendant.remove_tags(tags)

    def add_tag(self, tag):
        self.attributes["last_changed"] = datetime.utcnow()
        self.tags.add(tag)

        for descendant in self.descendant_notes:
            if "tags" in descendant.inherited_attrs:
                descendant.add_tag(tag)

    def remove_attrs(self, attrs):
        self.attributes["last_changed"] = datetime.utcnow()

        for attr in attrs:
            del self.attribute[attr]

        for descendant in self.descendant_notes:
            for attr in attrs:
                if attr in descendant.inherited_attrs:
                    descendant.remove_attrs()

    def add_attr(self, attr, value, prototypal=False):
        self.attributes["last_changed"] = datetime.utcnow()
        self.attributes[attr] = value

        if prototypal:
            for descendant in self.descendant_notes:
                descendant.inherited_attrs.add(attr)
                descendant.add_attr(attr, value, True)

    def update_attr(self, attr, value):
        self.attributes["last_changed"] = datetime.utcnow()
        self.attributes[attr] = value

        for descendant in self.descendant_notes:
            if attr in descendant.inherited_attrs:
                descendant.update_attr(attr, value)

    def create_duplicate(self):
        """Copies a note without creating an inheritance link."""
        new = Note(title=self.title,
                   text=self.text,
                   settings=self.settings,
                   attrs=self.attributes,
                   tags=self.tags,
                   parent_container=self.parent_container)
        new.attributes["date_created"] = datetime.utcnow()
        new.attributes["last_changed"] = datetime.utcnow()

        return new

    def create_descendant(self, inherited_attrs):
        """Creates a descendant note using prototypal inheritance."""
        new = Note(title=self.title,
                   text=self.text,
                   settings=self.settings.copy(),
                   attrs=self.attributes.copy(),
                   tags=self.tags.copy(),
                   prototype=self,
                   inherited_attrs=inherited_attrs,
                   parent_container=self.parent_container)

        new.attributes["date_created"] = datetime.utcnow()
        new.attributes["last_changed"] = datetime.utcnow()

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
            for _, val in self.attributes.items():
                if condition(val):
                    return True

        else:
            for attr in attrs:
                if condition(self.attributes[attr]):
                    return True

        return False

    def has_attr(self, attr):
        """Checks for the existence of an attribute in this note."""
        return attr in self.attributes

    def search_tags(self, condition):
        # Implement with container conditional?
        return condition(self.tags)

    def search_text(self, condition):
        return condition(self.text)

    def __str__(self):
        return self.title

    def __repr__(self):
        repr = "Title: {}\n".format(self.title)
        repr += "Text: {}\n".format(self.text)
        for key, val in self.attributes.items():
            repr += "{}: {}\n".format(key, val)
        return repr


class URL:
    def __init__(self, address):
        self.address_location = address

    @property
    def address(self):
        return self.address_location
