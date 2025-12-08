import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importar entorno

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

getCandidates(): Observable<any> {

    return this.http.get(`${this.apiUrl}/votes/candidates`); 
  }

  sendVote(document: string, candidateId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/votes/`, {
      document: document,
      candidate_id: candidateId
    });
  }

  getResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/votes/results`);
  }

  getVotesList() {
  return this.http.get<any[]>(`${this.apiUrl}/votes/all`);
}

getVoteDetail(id: number) {
  return this.http.get<any>(`${this.apiUrl}/votes/${id}`);
}


}