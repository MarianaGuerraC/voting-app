from sqlalchemy.orm import Session, aliased
from datetime import datetime, timezone #ya que utcnow esta en desuso
from sqlalchemy import func
from src.models import Admin, Voter, Vote
from src.schemas import (
    AdminCreate,
    VoterCreate,
    VoteCreate,
)


#crud admin
def create_admin(db: Session, admin: AdminCreate):
    db_admin = Admin(
        name=admin.name,
        lastName=admin.lastName,
        email=admin.email,
        password=admin.password  # ya viene hasheada desde el service
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


def get_admin_by_email(db: Session, email: str):
    #retorna admin x email (para login)
    return db.query(Admin).filter(Admin.email == email).first()


#crud voter
def create_voter(db: Session, voter: VoterCreate):
    #crea votante o candidato
    db_voter = Voter(
        name=voter.name,
        lastName=voter.lastName,
        document=voter.document,
        dob=voter.dob,
        is_candidate=voter.is_candidate,
    )
    db.add(db_voter)
    db.commit()
    db.refresh(db_voter)
    return db_voter


def get_voter_by_document(db: Session, document: str):
    #busca votante por documento
    return db.query(Voter).filter(Voter.document == document).first()


def get_all_candidates(db: Session):
    #devuelve solo candidatos
    return db.query(Voter).filter(Voter.is_candidate == True).all()


#votes crud
def register_new_vote(db: Session, vote: VoteCreate):
    #registra un nuevo voto en la base de datos, se asume que la 
    #logica de negocio (las validaciones) ya fueron realizadas en los services
    db_vote = Vote(
        candidate_id=vote.candidate_id,
        candidate_voted_id=vote.candidate_voted_id,
        date=vote.date if vote.date else datetime.now(timezone.utc)
    )

    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)

    return db_vote


def has_voter_already_voted(db: Session, voter_id: int):
    #verifica si un votante ya tiene un voto registrado.
    return (
        db.query(Vote)
        .filter(Vote.candidate_voted_id == voter_id)
        .first()
    )


def get_vote_results(db: Session):
    #obtiene los resultados de la votación (JOIN + GROUP BY).

    results = (
        db.query(
            Voter.id,
            Voter.name,
            Voter.lastName,
            func.count(Vote.candidate_id).label("vote_count")#cuenta las filas
        )
        .join(Vote, Vote.candidate_id == Voter.id)
        .filter(Voter.is_candidate == True)
        .group_by(Voter.id, Voter.name, Voter.lastName) #compatibilidad con sql moderno, para q funcione funcount
        .order_by(func.count(Vote.candidate_id).desc())
        .all()
    )

    return results

#busca votante por id
def get_voter_by_id(db: Session, voter_id: int):
    return db.query(Voter).filter(Voter.id == voter_id).first()

def get_all_voters(db: Session):
    #devuelve todos los votantes y candidatos
    return db.query(Voter).all()


def get_all_votes(db: Session):
    Candidate = aliased(Voter)

    rows = (
        db.query(
            Vote.id.label("vote_id"),
            Voter.name.label("voter_name"),
            Voter.lastName.label("voter_lastName"),
            Voter.document.label("voter_document"),
            Voter.dob.label("voter_dob"),
            Vote.date.label("vote_date"),
            Candidate.name.label("candidate_name"),
            Candidate.lastName.label("candidate_lastName")
        )
        .join(Voter, Voter.id == Vote.candidate_voted_id)
        .join(Candidate, Candidate.id == Vote.candidate_id)
        .order_by(Vote.date.desc())
        .all()
    )

    return [dict(r._mapping) for r in rows]


#ver detalle de un voto
def get_vote_detail(db: Session, vote_id: int):

    V2 = Voter.__table__.alias("v2")

    row = (
        db.query(
            Vote.id.label("vote_id"),
            Voter.name.label("voter_name"),
            Voter.lastName.label("voter_lastName"),
            Voter.document.label("voter_document"),
            Voter.dob.label("voter_dob"),
            Vote.date.label("vote_date"),
            V2.c.name.label("candidate_name"),
            V2.c.lastName.label("candidate_lastName")
        )
        .join(Voter, Voter.id == Vote.candidate_voted_id)
        .join(V2, Vote.candidate_id == V2.c.id)
        .filter(Vote.id == vote_id)
        .first()
    )

    return dict(row._mapping) if row else None
