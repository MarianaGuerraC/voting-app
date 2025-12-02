from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List 

from src.config.database import get_db 
from src.schemas import VoterCreate, VoterResponse
from src.services.voter_service import VoterService 

router = APIRouter(
    prefix="/voters", 
    tags=["Voters"]
)


@router.post("/", response_model=VoterResponse, status_code=status.HTTP_201_CREATED)
def create_voter(voter_data: VoterCreate, db: Session = Depends(get_db)):
    """
    Endpoint para que el admin agregue nuevos votantes o candidatos.
    """
    try:
        # Llama al service(la logica de negocio) para el registro y la validacion.
        db_voter = VoterService.register_voter(db, voter_data) 
        return db_voter
    except ValueError as e:
        #documento duplicado con 409 Conflict
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail=str(e) # ej "A voter with this document already exists" (mensaje en inglés del service)
        )


@router.get("/", response_model=List[VoterResponse])
def list_voters(db: Session = Depends(get_db)):
    """
    Lista todos los votantes y candidatos.
    """
    return VoterService.list_all_voters(db) 


@router.get("/{voter_id}", response_model=VoterResponse)
def get_voter_detail(voter_id: int, db: Session = Depends(get_db)):
    """
    Devuelve los detalles de un votante especifico por ID.
    """
    voter = VoterService.get_voter_by_id(db, voter_id) 
    
    if not voter:
        #devuelve 404 Not Found si el votante no existe
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voter not found.")
    return voter

#util para frontend
@router.get("/candidates", response_model=List[VoterResponse])
def list_candidates(db: Session = Depends(get_db)):
    """
    Lista todos los votantes que son candidatos.
    """
    return VoterService.list_candidates(db)