from sqlalchemy.orm import Session
from passlib.context import CryptContext

from src.crud import get_admin_by_email, create_admin
from src.schemas import AdminCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") #herramienta python

class AdminService:

    @staticmethod #estaticos xq no necesito estado de clase
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    #funcion para el login:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)


    @staticmethod
    def register_admin(db: Session, admin_data: AdminCreate):
        #verifico si ya existe
        existing = get_admin_by_email(db, admin_data.email)
        if existing:
            raise ValueError("Admin already exists") #en fastapi http 409 conflict

        #hasheo contraseña antes de guardar
        admin_data.password = AdminService.hash_password(admin_data.password)

        return create_admin(db, admin_data)

    @staticmethod
    def login_admin(db: Session, email: str, password: str):
        admin = get_admin_by_email(db, email)

        if not admin:
            raise ValueError("Invalid credentials")
        
        if not AdminService.verify_password(password, admin.password):
            raise ValueError("Invalid credentials")

        return admin
