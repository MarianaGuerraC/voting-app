from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.schemas import AdminPasswordUpdate
from src.services.admin_service import AdminService
from src.utils.jwt_handler import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.put("/change-password")
def change_password(
    passwords: AdminPasswordUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Cambia la contraseña del admin logueado.
    """
    if passwords.new_password != passwords.confirm_password:
        raise HTTPException(status_code=400, detail="The new passwords do not match")

    AdminService.change_password(
        db=db,
        admin_id=current_admin["id"],
        old_password=passwords.old_password,
        new_password=passwords.new_password
    )

    return {"message": "Password updated successfully"}