"""
Alembic env.py — migration environment configuration.

Reads DATABASE_URL from app settings, configures the SQLAlchemy async engine,
and imports all ORM models so autogenerate can detect schema changes.
"""

import asyncio
import os
import sys
from logging.config import fileConfig

# Ensure backend root directory is in sys.path
BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

# pyrefly: ignore [missing-import]
from sqlalchemy import pool
# pyrefly: ignore [missing-import]
from sqlalchemy.engine import Connection
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import async_engine_from_config

# pyrefly: ignore [missing-import]
from alembic import context

# Import the app's declarative Base and all models for autogenerate
from app.db.base import Base
import app.models  # noqa: F401  — ensures all models are registered on Base.metadata
from app.core.config import settings

# Alembic Config object — provides access to alembic.ini
config = context.config

# Override sqlalchemy.url from app settings so we never need two sources of truth
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Set up Python logging from the ini file
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for autogenerate support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode — emits SQL to stdout."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations in 'online' mode with an async engine."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Entry point for online mode — delegates to the async runner."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
