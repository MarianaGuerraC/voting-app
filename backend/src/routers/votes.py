from fastapi import APIRouter

# 🚨 La clave: Definición del objeto router
router = APIRouter(
    prefix="/votes",
    tags=["votes"]
)

# Endpoint de prueba simple
@router.get("/test")
def test_votes_route():
    return {"message": "Votes router is working!"}