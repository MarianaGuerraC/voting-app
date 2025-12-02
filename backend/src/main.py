from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.config.database import engine
from src.routers import votes, voters, auth
from src.models import Base

#lifespan para inicialización de la db ya q on_event esta en desuso
@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup
    Base.metadata.create_all(bind=engine)
    print("Database initialized")
    yield
    #shutdown
    print("App shutting down")

app = FastAPI(lifespan=lifespan)

#routers
app.include_router(votes.router)
app.include_router(voters.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Voting API running! Access /docs for endpoints."}