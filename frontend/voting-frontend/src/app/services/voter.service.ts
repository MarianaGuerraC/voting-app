import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Voter, VoterPayload } from '../models/voter.model'; 

@Injectable({
  providedIn: 'root'
})
export class VoterService {
  private apiUrl = `${environment.apiUrl}/voters`; 

  constructor(private http: HttpClient) { }

  getVoters(): Observable<Voter[]> {
    return this.http.get<Voter[]>(this.apiUrl);
  }

  createVoter(voterData: VoterPayload): Observable<Voter> {
    return this.http.post<Voter>(this.apiUrl, voterData);
  }

  updateVoter(id: number, voterData: VoterPayload): Observable<Voter> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Voter>(url, voterData);
  }
//obtiene votante x id, lo uso en voter-form.component.ts
  getVoterById(id: number): Observable<Voter> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Voter>(url);
  }
}