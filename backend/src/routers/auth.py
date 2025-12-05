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
    Inicia sesión verificando email y contraseña hasheada.
    Devuelve JWT y datos del admin.
    """
    try:
        #intento login
        admin_orm = AdminService.login_admin(db, login_data.email, login_data.password)
    except HTTPException as e:
        #si falla doy error 401
        raise e
    except Exception as e:
        #cualquier otro error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    #genero token
    access_token = create_access_token({
        "sub": admin_orm.email,
        "id": admin_orm.id
    })

    #respuesta para angular
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin_orm.id,
            "name": admin_orm.name,
            "lastName": admin_orm.lastName,
            "email": admin_orm.email
        }
    }