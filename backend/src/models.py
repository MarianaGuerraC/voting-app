from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()
#MODELO DE DATOS RELACIONAL USANDO SQLALCHEMY
#admins
class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    lastName = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)


#voters votantes / candidatos
class Voter(Base):
    __tablename__ = "voters"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    lastName = Column(String(255), nullable=False)
    document = Column(String(255), nullable=False)
    dob = Column(Date, nullable=False)
    is_candidate = Column(Integer, nullable=False)  # tinyint(1)

    #votos que esta persona emitio
    votes_made = relationship(
        "Vote",
        foreign_keys="Vote.candidate_voted_id",
        back_populates="voter"
    )

    #votos que esta persona recibio
    votes_received = relationship(
        "Vote",
        foreign_keys="Vote.candidate_id",
        back_populates="candidate"
    )


#votes
class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    candidate_voted_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    date = Column(DateTime)

    #quien voto (votante)
    voter = relationship(
        "Voter",
        foreign_keys=[candidate_voted_id],
        back_populates="votes_made"
    )

    #quien recibio el voto (candidato)
    candidate = relationship(
        "Voter",
        foreign_keys=[candidate_id],
        back_populates="votes_received"
    )
