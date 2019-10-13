class Conditional:
    def __init__(self, target, condition):
        self.target = target
        self.condition = condition


class NumberConditional(Conditional):
    def __call__(self, query):
        if self.condition == "gt":
            return query > self.target
        elif self.condition == "egt":
            return query >= self.target
        elif self.condition == "lt":
            return query < self.target
        elif self.condition == "elt":
            return query <= self.target
        else:
            return query == self.target


class StringConditional(Conditional):
    def __call__(self, query):
        if self.condition == "contains":
            return self.target in query
        else:
            return self.target not in query

