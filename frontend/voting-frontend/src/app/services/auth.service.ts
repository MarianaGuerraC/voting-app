import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
//uso una infraestructura para los tokens JWT
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/login`;

  //BehaviorSubject para rastrear el estado y saber si hay un token
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable(); 

  constructor(private http: HttpClient) { }

  //Realiza el login y almacena el token JWT.
login(email: string, password: string): Observable<any> {
  const loginData = { email, password };

  return this.http.post<any>(this.apiUrl, loginData, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    tap(response => {
      const token = response.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
        if (response.admin) {
          localStorage.setItem('admin', JSON.stringify(response.admin));
        }
        this.loggedIn.next(true);
      }
    })
  );
}



  //Cierra la sesion eliminando el token.
logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin');
    this.loggedIn.next(false);
  }

  //Verifica si existe un token almacenado.

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  //Obtiene el token JWT actual.
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
