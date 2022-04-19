from flask import current_app as app
from typing import List

from ecommerce.models import User


def user_cart_key(user: User) -> str:
    return f"user-cart-{user.id}"


def get_cart(user: User) -> List[str]:
    return app.cache.get(user_cart_key(user)) or []


def set_cart(user: User, cart: List[str]) -> None:
    app.cache.set(user_cart_key(user), cart)


def add_to_cart(user: User, item_id: str, quantity: int) -> None:
    cart = get_cart(user)
    cart.extend([item_id] * quantity)
    set_cart(user, cart)
