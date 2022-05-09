from ecommerce.utils import get_cart


def test_get_cart(mocker, user, app):
    mock_cache = mocker.patch("cachelib.RedisCache.get")
    mock_cache.return_value = ["1", "2", "3"]

    assert get_cart(user) == ["1", "2", "3"]
