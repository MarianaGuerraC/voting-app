from sqlalchemy.orm import Session
from passlib.context import CryptContext

from src.crud import get_admin_by_email, create_admin
from src.schemas import AdminCreate

from fastapi import HTTPException, status


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
        if not admin or not AdminService.verify_password(password, admin.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect credentials"
            )
        return admin

    @staticmethod
    def change_password(db: Session, admin_id: int, old_password: str, new_password: str):

        #traigo admin por id
        from src.models import Admin
        admin = db.query(Admin).filter(Admin.id == admin_id).first()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        #verifico contraseña actual
        if not AdminService.verify_password(old_password, admin.password):
            raise HTTPException(status_code=400, detail="Wrong current password")

        #hasheo nueva contraseña
        admin.password = AdminService.hash_password(new_password)

        db.commit()
        db.refresh(admin)

        return admin
