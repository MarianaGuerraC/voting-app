from fastapi import APIRouter

# 🚨 La clave: Definición del objeto router
router = APIRouter(
    prefix="/voters",
    tags=["Voters"]
)

# Endpoint de prueba simple
@router.get("/test")
def test_voters_route():
    return {"message": "Voters router is working!"}