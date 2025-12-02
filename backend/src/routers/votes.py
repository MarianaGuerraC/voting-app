from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.schemas import VoteAPICreate, CandidateResult
from src.services.vote_service import VoteService
from src.config.database import get_db

router = APIRouter(
    prefix="/votes",
    tags=["votes"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def cast_vote(vote: VoteAPICreate, db: Session = Depends(get_db)):
    """
    Emite voto
    Devuelve mensaje de exito y el id del voto registrado.
    Maneja errores especificos con codigos HTTP correctos.
    """
    try:
        registered_vote = VoteService.cast_vote(db, vote)
        return {"message": "The vote was processed correctly.", "vote_id": registered_vote.id}
    
    except ValueError as e:
        detail_str = str(e)
        
        if "already voted" in detail_str:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A vote was already registered previously."
            )
        elif "Voter not found" in detail_str:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The voter could not be found."
            )
        elif "valid candidate" in detail_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected candidate is not a valid candidate."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=detail_str
            )

@router.get("/results", response_model=list[CandidateResult])
def vote_results(db: Session = Depends(get_db)):
    """
    Obtiene resultados de la votación.
    Devuelve lista de candidatos con cantidad de votos.
    """
    return VoteService.results(db)
