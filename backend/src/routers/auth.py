from fastapi import APIRouter

# 🚨 La clave: Definición del objeto router
router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Endpoint de prueba simple
@router.get("/test")
def test_auth_route():
    return {"message": "Auth router is working!"}