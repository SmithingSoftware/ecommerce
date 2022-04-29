from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy_serializer import SerializerMixin
import uuid

# Local imports
from ecommerce import db


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

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Numeric, nullable=False)


class User(UserMixin, db.Model, Serialized):
    serialize_only = ("id", "name", "email")

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    is_admin = db.Column(db.Boolean, default=False)
