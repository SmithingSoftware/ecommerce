import os

import pytest
import sqlite3
import sqlalchemy
from ecommerce import create_app



def pytest_generate_tests(metafunc):
    os.environ['FLASK_CONFIG'] = 'config.TestConfig'

@pytest.fixture
def app():
  application = create_app()
  with application.app_context():
    yield application

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