from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.utils.jwt_handler import create_access_token
from src.config.database import get_db 
from src.schemas import AdminCreate, AdminLogin, AdminResponse 
from src.services.admin_service import AdminService

router = APIRouter(
    prefix="/auth", 
    tags=["Auth"]
)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_admin(admin_data: AdminCreate, db: Session = Depends(get_db)):
    try:
        admin = AdminService.register_admin(db, admin_data)

        #token despues de crear el admin para un mejor UX, signup automatico        
        token = create_access_token({"sub": admin.email, "id": admin.id})
        return {
            "access_token": token,
            "token_type": "bearer",
            "admin": AdminResponse.model_validate(admin)
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )




#inicio de sesion
@router.post("/login") 
def login_admin(login_data: AdminLogin, db: Session = Depends(get_db)):
    """
    Inicia sesion verificando el email y la contraseña hasheada.
    """
    try:
        admin_orm = AdminService.login_admin(
            db, login_data.email, login_data.password
        )

        # GENERAR TOKEN JWT
        access_token = create_access_token({
            "sub": admin_orm.email,
            "id": admin_orm.id
        })

        # RESPUESTA CORRECTA PARA ANGULAR
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except ValueError:
        #401 Unauthorized si las credenciales son inválidas
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )