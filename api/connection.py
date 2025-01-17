from uuid import uuid1

from api.note import Note


class Connection:
    """Class used for creating links between notes."""
    def __init__(self, endpoint_one, endpoint_two, text=None, id=None):
        self.id = id if id else uuid1
        self.endpoint_one = endpoint_one if endpoint_one else None
        self.endpoint_two = endpoint_two if endpoint_two else None

        self.text = text

        if type(endpoint_one) is Note:
            endpoint_one.connections.append(self)

        if type(endpoint_two) is Note:
            endpoint_two.connections.append(self)

    def change_first_endpoint(self, new_target):
        self.endpoint_one = new_target

    def change_second_endpoint(self, new_target):
        self.endpoint_two = new_target

    def change_label(self, text):
        self.text = None if text == "" else text

    """
    def open_endpoint_one(self):
        if type(self.endpoint_one) is URL:
            request.urlopen(self.endpoint_one.address)

    def open_endpoint_two(self):
        if type(self.endpoint_two) is URL:
            request.urlopen(self.endpoint_two.address)
    """
    def serialize(self):
        data = dict()
        data["id"] = self.id

        data["endpoint_one"] = (self.endpoint_one.id
                                if self.endpoint_one else None)

        data["endpoint_two"] = (self.endpoint_two.id
                                if self.endpoint_two else None)

        data["text"] = self.text
        data["type"] = "connection"
        return data

    @classmethod
    def from_dict(cls, data):
        return cls(id=data["id"],
                   endpoint_one=data["endpoint_one"],
                   endpoint_two=data["endpoint_two"],
                   text=data["text"])
