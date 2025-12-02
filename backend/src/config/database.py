from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from src.models import Base

load_dotenv()  #cargo variables del .env

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = (
    f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


#necesaria para lifespan en main.py
def create_db_tables():
    #crea todas las tablas definidas en Base.metadata si no existen
    Base.metadata.create_all(bind=engine)

#dependencia para fastapi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
