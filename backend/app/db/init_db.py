from sqlalchemy import inspect, text

from backend.app.db import models  # noqa: F401
from backend.app.db.base import Base
from backend.app.db.session import engine


def _ensure_table_columns() -> None:
    inspector = inspect(engine)
    metadata_tables = Base.metadata.tables

    for table_name, table in metadata_tables.items():
        if table_name not in inspector.get_table_names():
            continue

        existing_columns = {column["name"] for column in inspector.get_columns(table_name)}
        for column in table.columns:
            if column.name in existing_columns:
                continue

            column_type = column.type.compile(dialect=engine.dialect)
            nullable = " NOT NULL" if not column.nullable else ""
            default_sql = ""
            if column.default is not None and not isinstance(column.default, str):
                default_sql = f" DEFAULT {column.default.arg if hasattr(column.default, 'arg') else column.default!s}"
            elif column.default is not None and hasattr(column.default, "arg"):
                default_sql = f" DEFAULT {column.default.arg}"

            sql = f'ALTER TABLE "{table_name}" ADD COLUMN "{column.name}" {column_type}{nullable}{default_sql};'
            with engine.begin() as connection:
                connection.execute(text(sql))


def create_all_tables() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_table_columns()


def verify_database_connection() -> None:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
