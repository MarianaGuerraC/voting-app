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
    Endpoint para emitir un voto.
    Devuelve mensaje de éxito y el ID del voto.
    Maneja errores específicos con códigos HTTP correctos.
    """
    try:
        registered_vote = VoteService.cast_vote(db, vote)
        return {"message": "El voto se procesó correctamente.", "vote_id": registered_vote.id}
    
    except ValueError as e:
        detail_str = str(e)
        
        if "already voted" in detail_str:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya fue registrado un voto con anterioridad."
            )
        elif "Voter not found" in detail_str:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Votante no encontrado."
            )
        elif "valid candidate" in detail_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El candidato seleccionado no es válido."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=detail_str
            )

@router.get("/results", response_model=list[CandidateResult])
def vote_results(db: Session = Depends(get_db)):
    """
    Endpoint para obtener resultados de la votación.
    Devuelve lista de candidatos con cantidad de votos.
    """
    return VoteService.results(db)
