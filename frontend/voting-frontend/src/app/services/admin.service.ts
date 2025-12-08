import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Llama al endpoint PUT /admin/change-password
  changePassword(payload: ChangePasswordPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/change-password`, payload);
  }
}
