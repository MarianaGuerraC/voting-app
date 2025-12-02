from sqlalchemy.orm import Session
from datetime import datetime

from src.crud import (
    register_new_vote,
    has_voter_already_voted,
    get_vote_results,
    get_voter_by_id
)
from src.services.voter_service import VoterService
from src.schemas import VoteAPICreate, VoteCreate, CandidateResult


class VoteService:

    @staticmethod
    def cast_vote(db: Session, vote_data: VoteAPICreate):
        """
        Procesa un voto:
        1 valido que el votante exista
        2 valido que el votante no haya votado antes
        3 valido que el candidato exista y sea candidato
        4 registro el voto
        """
        #1
        #ya lanza el error si no existe
        voter = VoterService.find_voter_by_document(db, vote_data.document)

        #2
        if has_voter_already_voted(db, voter.id):
            raise ValueError("This voter has already voted")

        #3
        candidate = get_voter_by_id(db, vote_data.candidate_id)
        if not candidate or not candidate.is_candidate:
            raise ValueError("The selected person is not a valid candidate")

        #4
        vote_internal = VoteCreate(
            candidate_id=candidate.id,
            candidate_voted_id=voter.id,
            date=datetime.utcnow()
        )

        # Registrar voto en DB
        registered_vote = register_new_vote(db, vote_internal)
        return registered_vote

    @staticmethod
    def results(db: Session):
        
        #Devuelvo los resultados de las votaciones
        raw_results = get_vote_results(db)
        formatted = [
            CandidateResult(
                id=row[0],
                name=row[1],
                lastName=row[2],
                vote_count=row[3]
            )
            for row in raw_results
        ]
        return formatted
