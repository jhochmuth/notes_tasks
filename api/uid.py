class UID:
    __uid_index = -1

    @classmethod
    def assign_uid(cls):
        cls.__uid_index += 1
        return str(cls.__uid_index)