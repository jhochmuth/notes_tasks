from api.conditional import NumberConditional


def test_number_conditional():
    condition = NumberConditional(target=25, condition="gt")
    assert condition(0) is False
    assert condition(50) is True

    condition = NumberConditional(target=25, condition="lt")
    assert condition(0) is True
    assert condition(50) is False

    condition = NumberConditional(target=25, condition="egt")
    assert condition(25) is True
