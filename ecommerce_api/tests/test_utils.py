import pytest
from ecommerce.models import User
from ecommerce.utils import get_cart, user_cart_key


@pytest.fixture
def user():
    return User(email="test@test.com", password="test")

@pytest.fixture
def admin_user():
    return User(email="admin@test.com", password="test", is_admin=True)


def test_get_cart(mocker, user, app):
    mock_cache = mocker.patch("cachelib.RedisCache.get")
    mock_cache.return_value = ["1", "2", "3"]

    assert get_cart(user_cart_key(user)) == ["1", "2", "3"]
