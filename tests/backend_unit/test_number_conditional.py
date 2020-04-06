from api.conditional import Conditional


def test_number_conditional():
    condition = Conditional(target="25", condition="gt")
    assert condition("0") is False
    assert condition("50") is True

    condition = Conditional(target="25", condition="lt")
    assert condition("0") is True
    assert condition("50") is False

    condition = Conditional(target="25", condition="ge")
    assert condition("25") is True
