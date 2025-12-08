from fastapi import FastAPI
from src.config.database import engine
from src.models import Base
from src.routers import votes, voters, auth
from fastapi.middleware.cors import CORSMiddleware

# Inicializar DB antes de crear la app
Base.metadata.create_all(bind=engine)
print("Database initialized")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(votes.router)
app.include_router(voters.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Voting API running! Access /docs for endpoints."}
