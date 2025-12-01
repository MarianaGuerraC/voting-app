from fastapi import FastAPI
from src.config.database import engine
from src.models import Base

app = FastAPI()

#al iniciar la app crea las tablas
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Voting API running!"}
