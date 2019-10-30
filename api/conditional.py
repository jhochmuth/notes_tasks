import operator

from api.uid import UID


conditions = {"gt": operator.gt,
              "ge": operator.ge,
              "lt": operator.lt,
              "le": operator.le,
              "eq": operator.eq}


class Conditional:
    def __init__(self, target, condition):
        self.id = UID().assign_uid()
        self.target = target
        self.condition = condition


class NumberConditional(Conditional):
    def __call__(self, query):
        return conditions[self.condition](query, self.target)


class StringConditional(Conditional):
    def __call__(self, query):
        if self.condition == "contains":
            return self.target in query
        else:
            return self.target not in query
