from ecommerce.utils import add_to_cart, get_cart, set_cart


def test_get_cart(mocker, user, app):
    mock_cache = mocker.patch("cachelib.SimpleCache.get")
    mock_cache.return_value = ["1", "2", "3"]

    assert get_cart(user) == ["1", "2", "3"]

def test_set_cart(mocker, user, app):
    assert get_cart(user) == []

    set_cart(user, ["1", "2"])
    assert get_cart(user) == ["1", "2"]

def test_add_to_cart(mocker, user, app):
    add_to_cart(user, "1")
    assert get_cart(user) == ["1"]

    add_to_cart(user, "2")
    assert get_cart(user) == ["1", "2"]

def test_add_to_cart_multiple(mocker, user, app):
    assert get_cart(user) == []

    add_to_cart(user, "1", 5)
    assert get_cart(user) == ["1"] * 5
