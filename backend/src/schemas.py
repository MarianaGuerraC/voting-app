from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


#admin schemas
class AdminBase(BaseModel):
    name: str = Field(..., max_length=255)
    lastName: str = Field(..., max_length=255)
    email: EmailStr = Field(..., max_length=255)

class AdminCreate(AdminBase): #uso adminbase xq incluye los datos de admin base mas la psw
    password: str
    
class AdminLogin(BaseModel): #uso basemodel xq no necesito los otros datos
    email: EmailStr
    password: str

class AdminResponse(AdminBase):
    id: int
    model_config = ConfigDict(from_attributes=True)#pydantic v2


#voter schemas
class VoterBase(BaseModel):
    name: str = Field(..., max_length=255)
    lastName: str = Field(..., max_length=255)
    document: str = Field(..., max_length=255)
    dob: date
    is_candidate: bool

class VoterCreate(VoterBase):
    pass

class VoterResponse(VoterBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class CandidatePublic(BaseModel):
    id: int
    name: str
    lastName: str
    model_config = ConfigDict(from_attributes=True)


#vote schemas
#esquema de API
class VoteAPICreate(BaseModel):
    document: str
    candidate_id: int

#esquemas internos SQL
class VoteBase(BaseModel):
    candidate_id: int #candidato que recibe el voto
    candidate_voted_id: int #persona que votó
    date: datetime | None = None

class VoteCreate(VoteBase):
    pass

class VoteResponse(VoteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


#resultados
class CandidateResult(BaseModel):
    id: int
    name: str
    lastName: str
    vote_count: int
    model_config = ConfigDict(from_attributes=True)

#para cambiar la contraseña del admin
class AdminPasswordUpdate(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str
