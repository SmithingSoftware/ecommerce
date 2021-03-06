"""Adding available field on product

Revision ID: 4721570736b0
Revises: 8f602d7b0628
Create Date: 2022-05-22 10:42:09.611829

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4721570736b0'
down_revision = '8f602d7b0628'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('product', sa.Column('available', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('product', 'available')
    # ### end Alembic commands ###
