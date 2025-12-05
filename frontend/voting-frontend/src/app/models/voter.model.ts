export interface Voter {
  id: number;
  name: string;
  lastName: string;
  document: string;
  dob: Date;
  is_candidate: boolean;
}
//el modelo del votante que obtenemos de la api
export interface Voter { 
  id: number;
  email: string;
  name: string;
}

//el modelo de datos que enviamos a la api para crear o actualizar votantes
export interface VoterPayload { 
  email: string;
  name: string;
}