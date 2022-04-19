from distutils.command.config import config
from flask import Flask, Response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from cachelib.redis import RedisCache

import logging

db = SQLAlchemy()

logging.basicConfig()
logger = logging.Logger(__name__)
logger.setLevel(logging.DEBUG)


def init_cache(app):
    cache = RedisCache(host=app.config["REDIS_HOST"], port=app.config["REDIS_PORT"])
    app.cache = cache
    return app


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    init_cache(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    from ecommerce.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get((user_id))

    with app.app_context():
        # from ecommerce import routes
        from ecommerce.models import Product
        from ecommerce import routes

        db.create_all()
        return app
