import os
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from cachelib.redis import RedisCache
from celery import Celery
from prometheus_flask_exporter import PrometheusMetrics

from ecommerce.admin import init_admin

import logging

db = SQLAlchemy()

logging.basicConfig()
logger = logging.Logger(__name__)
logger.setLevel(logging.DEBUG)


def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config["CELERY_RESULT_BACKEND"],
        broker=app.config["CELERY_BROKER_URL"],
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    app.celery = celery
    return celery


def init_metrics(app):
    metrics = PrometheusMetrics(app)
    app.metrics = metrics
    return app


def init_cache(app):
    cache = RedisCache(host=app.config["REDIS_HOST"],
                       port=app.config["REDIS_PORT"])
    app.cache = cache
    return app


def init_migrate(app):
    Migrate(app, db)
    return app


def create_app():
    app = Flask(__name__)
    app.config.from_object(os.getenv("FLASK_CONFIG"))

    db.init_app(app)

    init_cache(app)
    make_celery(app)
    init_metrics(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    from ecommerce.models import User, Product

    init_migrate(app)
    init_admin(app, db, [User, Product])

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get((user_id))

    with app.app_context():
        db.create_all()
        return app
