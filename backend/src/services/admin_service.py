from sqlalchemy.orm import Session
from passlib.context import CryptContext

from src.crud import get_admin_by_email, create_admin
from src.schemas import AdminCreate

# Usamos Argon2 (ya que el bcrypt me dio problemas)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class AdminService:

    @staticmethod
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

        hashed = AdminService.hash_password(admin_data.password)
        admin_data.password = hashed

        return create_admin(db, admin_data)

    @staticmethod
    def login_admin(db: Session, email: str, password: str):
        admin = get_admin_by_email(db, email)

        if not admin:
            raise ValueError("Invalid credentials")
        
        if not AdminService.verify_password(password, admin.password):
            raise ValueError("Invalid credentials")

        return admin
