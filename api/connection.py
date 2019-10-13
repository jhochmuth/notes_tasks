from api.note import Note, URL

from urllib import request


class Connection:
    def __init__(self, text=None, endpoint_one=None, endpoint_two=None):
        self.endpoint_one = endpoint_one
        self.endpoint_two = endpoint_two

        self.text = text

        if type(endpoint_one) is Note:
            endpoint_one.connections.append(self)

        if type(endpoint_two) is Note:
            endpoint_two.connections.append(self)

    def change_first_endpoint(self, new_target):
        self.endpoint_one = new_target

    def change_second_endpoint(self, new_target):
        self.endpoint_two = new_target

    def open_endpoint_one(self):
        if type(self.endpoint_one) is URL:
            request.urlopen(self.endpoint_one.address)

    def open_endpoint_two(self):
        if type(self.endpoint_two) is URL:
            request.urlopen(self.endpoint_two.address)
