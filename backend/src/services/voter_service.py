from sqlalchemy.orm import Session

from src.crud import (
    create_voter,
    get_voter_by_document,
    get_all_candidates,
    get_all_voters,
    get_voter_by_id
)
from src.schemas import VoterCreate


class VoterService:

    @staticmethod
    def register_voter(db: Session, voter_data: VoterCreate):
        #valido que el documento no exista
        existing = get_voter_by_document(db, voter_data.document)
        if existing:
            raise ValueError("A voter with this document already exists")#uso value, para q el router maneje los errores

        return create_voter(db, voter_data)

    @staticmethod
    def find_voter_by_document(db: Session, document: str):
        voter = get_voter_by_document(db, document)

        if not voter:
            raise ValueError("Voter not found")

        return voter

    @staticmethod
    def list_candidates(db: Session):
        return get_all_candidates(db)

    @staticmethod
    def list_all_voters(db: Session):
        return get_all_voters(db)

    @staticmethod
    def get_voter_by_id(db: Session, voter_id: int):
        voter = get_voter_by_id(db, voter_id)
        return voter