import click
import json
import uuid
from flask import Blueprint
from flask import current_app
from werkzeug.security import generate_password_hash

bp = Blueprint('api', __name__)


@bp.cli.group()
@click.option('--debug/--no-debug', default=False)
@click.pass_context
def cli(ctx, debug):
    click.echo(f'Running ecommerce cli. Debug? {debug}')
    ctx.ensure_object(dict)


@cli.group()
def db():
    click.echo(f'Running database commands')


@db.command()
@click.option('number', '-n', default=10)
def seed_users(number):
    click.echo(f'seeding database with users')
    from ecommerce.models import User
    for i in range(number):
        generated = str(uuid.uuid4())
        name = generated[0:8]

        pw_hash = generate_password_hash(generated, method="sha256")
        user = User(
            name=name,
            password=pw_hash,
            email=f'{name}@smithingsoftware.com',
        )
        current_app.db.session.add(user)
        click.echo(
            f'Created user {user.name} with email {user.email} and password {generated}')
    current_app.db.session.commit()


@db.command()
def seed_products():
    click.echo(f'populating products from ecommerce/data/products.json')
    from ecommerce.models import Product, Tag
    with open('ecommerce/data/products.json', 'r') as f:
        data = json.load(f)
        for product_data in data:
            tags = product_data.pop('tags')
            # remove non-uuid ids, generate
            product_data.pop('id')
            product = Product(**product_data)
            tags = [Tag(name=tag, product_id=product.id) for tag in tags]
            for tag in tags:
                current_app.db.session.add(tag)
            current_app.db.session.add(product)
    current_app.db.session.commit()
    click.echo('Seeded products!')


if __name__ == '__main__':
    cli(obj={})
