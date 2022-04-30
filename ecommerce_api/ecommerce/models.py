from flask_login import UserMixin
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy_serializer import SerializerMixin
import uuid

# Local imports
from ecommerce import db

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses
    CHAR(32), storing as stringified hex values.
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(UUID())
        else:
            return dialect.type_descriptor(CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                # hexstring
                return "%.32x" % value.int
    
    def _uuid_value(self, value):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value         

    def process_result_value(self, value, dialect):
        return self._uuid_value(value)

    def sort_key_function(self, value):
        return self._uuid_value(value)


class Serialized(SerializerMixin):
    complex_types = (dict, uuid.UUID)

    serialize_types = ((UUID, lambda x: str(x)),)


class Product(db.Model, Serialized):
    serialize_only = (
        "id",
        "name",
        "description",
        "image",
        "price",
    )

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Numeric, nullable=False)


class User(UserMixin, db.Model, Serialized):
    serialize_only = ("id", "name", "email")

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    is_admin = db.Column(db.Boolean, default=False)
