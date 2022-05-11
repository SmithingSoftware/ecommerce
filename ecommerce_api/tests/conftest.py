import os
import uuid
import pytest
import sqlite3
from flask_login import FlaskLoginClient
from ecommerce import create_app
from ecommerce.models import User



def pytest_generate_tests(metafunc):
    os.environ['FLASK_CONFIG'] = 'config.TestConfig'

@pytest.fixture
def app():
  application = create_app()
  application.test_client_class = FlaskLoginClient
  with application.app_context():
    yield application


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture # 1
def session():
    connection = sqlite3.connect(':memory:') # 2
    db_session = connection.cursor()
    db_session.execute('''CREATE TABLE numbers
                          (number text, existing boolean)''') # 3
    db_session.execute('INSERT INTO numbers VALUES ("+3155512345", 1)') # 4
    connection.commit()
    yield db_session # 5
    connection.close()

@pytest.fixture
def user():
    return User(email="test@test.com", password="test", id=uuid.uuid4())

@pytest.fixture
def admin_user():
    return User(email="admin@test.com", password="test", is_admin=True, id=uuid.uuid4())
