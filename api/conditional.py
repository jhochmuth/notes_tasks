class Conditional:
    def __init__(self, id, target, condition):
        self.id = id
        self.target = target
        self.condition = condition


class NumberConditional(Conditional):
    def __call__(self, query):
        return self.condition(query, self.target)


class StringConditional(Conditional):
    def __call__(self, query):
        if self.condition == "contains":
            return self.target in query
        else:
            return self.target not in query
