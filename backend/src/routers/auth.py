from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.config.database import get_db 
from src.schemas import AdminCreate, AdminLogin, AdminResponse 
from src.services.admin_service import AdminService

router = APIRouter(
    prefix="/auth", 
    tags=["Auth"]
)

@router.post("/register", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def register_admin(admin_data: AdminCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo administrador, con hash de contraseña.
    """
    try:
        db_admin = AdminService.register_admin(db, admin_data)
        return db_admin
    except ValueError as e:
        #409 Conflict si el email ya existe
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
        
        #Devuelve el objeto admin de respuesta
        return AdminResponse.model_validate(admin_orm)
        
    except ValueError:
        #401 Unauthorized si las credenciales son inválidas
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )