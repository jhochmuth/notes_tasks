from api.conditional import StringConditional


def test_string_conditional():
    condition = StringConditional(target="British", condition="contains")
    assert condition("blah British blah") is True
    assert condition("blah Irish blah") is False
