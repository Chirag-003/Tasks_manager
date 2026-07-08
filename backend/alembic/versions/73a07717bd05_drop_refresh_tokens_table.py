"""drop refresh tokens table

Revision ID: 73a07717bd05
Revises: 2243e1c19fd2
Create Date: 2026-07-08 15:10:14.255659

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "73a07717bd05"
down_revision: Union[str, Sequence[str], None] = "2243e1c19fd2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("refresh_tokens")


def downgrade() -> None:
    """Downgrade schema."""
    pass
