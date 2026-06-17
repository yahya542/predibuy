from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.schema import CreateColumn

from app.config import Settings

settings = Settings()
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def sync_database_schema():
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)

    for table in Base.metadata.sorted_tables:
        existing_columns = {column["name"] for column in inspector.get_columns(table.name)}
        with engine.begin() as connection:
            for column in table.columns:
                if column.name not in existing_columns:
                    column_definition = str(CreateColumn(column).compile(dialect=engine.dialect))
                    connection.execute(
                        text(f'ALTER TABLE "{table.name}" ADD COLUMN {column_definition}')
                    )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
