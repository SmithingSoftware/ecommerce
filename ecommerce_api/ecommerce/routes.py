import json

from flask import abort, request, Response, redirect, url_for, make_response, jsonify
from flask import current_app as app
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from ecommerce.models import Product, User
from ecommerce.utils import get_cart, add_to_cart, set_cart
from ecommerce.tasks import add
from ecommerce import db, logger

statsd  = app.statsd_client


@app.route("/health")
def health():
    return "OK"


@app.route("/product", methods=["POST"])
def product() -> Response:
    data = request.json
    item = Product(**data)
    db.session.add(item)
    db.session.commit()

    created = db.session.query(Product).get(item.id)
    return json.dumps({"product": created.to_dict()})


@app.route("/products")
def products() -> Response:
    products = db.session.query(Product).all()
    return json.dumps({"products": [product.to_dict() for product in products]})


@app.route("/login", methods=["POST"])
def login_post() -> Response:

    data = request.json
    email = data.get("email")
    password = data.get("password")
    remember = data.get("remember", True)

    app.logger.info(f"Login attempt: {email}")

    user = _authenticate(email, password, remember)
    if not user:
        app.logger.info(f"Login failed: {email}")
        return make_response(jsonify({"error": "Invalid credentials"}), 401)

    app.logger.info(f"Login success: {email}")
    return make_response(jsonify({"user": user.to_dict()}), 200)

@app.route("/user")
@login_required
def user() -> Response:
    return jsonify({"user": current_user.to_dict()})


@app.route("/logout", methods=['POST'])
@login_required
def logout() -> Response:
    logout_user()
    return "logout"


@app.route("/signup", methods=["POST"])
def signup_post() -> Response:
    data = request.json
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user:
        # TODO: flash error
        return redirect(url_for("login_post"))

    hashed_password = generate_password_hash(password, method="sha256")
    user = User(email=email, name=name, password=hashed_password)

    db.session.add(user)
    db.session.commit()

    return make_response(jsonify({"user": user}), 201)


@app.route("/cart", methods=["GET"])
@login_required
def cart() -> Response:
    logger.info(f"Getting cart for user {current_user.id}")
    return make_response(jsonify({"cart": get_cart(current_user)}), 200)


@app.route("/cart/bulk", methods=["POST"])
@login_required
def cart_bulk() -> Response:
    data = request.json
    items = data.get("items")
    set_cart(current_user, items)
    return make_response(jsonify({"cart": get_cart(current_user)}), 200)


@app.route("/cart", methods=["POST"])
@login_required
def add_to_cart() -> Response:
    data = request.json
    item_id = data.get("item_id")
    quantity = data.get("quantity", 1)
    if not item_id:
        abort(400)

    logger.info(f"Adding item {item_id} to cart for user {current_user.id}")
    add_to_cart(current_user, item_id, quantity=quantity)
    return make_response(200)


def admin_required(func):
    def wrapper(*args, **kwargs):
        if not current_user.is_admin:
            return make_response(jsonify({"error": "Admin required"}), 401)
        return func(*args, **kwargs)

    return wrapper


@app.route("/_admin/products", methods=["POST"])
def post_products() -> Response:
    data = request.json
    products = data.get("products", [])
    created_products = []
    for product in products:
        created = Product(**data)
        db.session.add(created)
        created_products.append(created.id)

    db.session.commit()
    created_products = [
        db.session.query(Product).get(p.id).to_dict() for p in created_products
    ]
    return json.dumps({"products": created_products})

@app.route("/task/test")
def task() -> Response:
    result = add.delay(1, 2)
    return jsonify({"task_id": result.id})


@app.route("/stats/test")
def submit_stats() -> Response:
    statsd.incr("test.counter", 1)
    return jsonify({"stats": "ok"})


def _authenticate(email, password, remember=True):
    user = db.session.query(User).filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return None
    login_user(user, remember=remember)
    return user

