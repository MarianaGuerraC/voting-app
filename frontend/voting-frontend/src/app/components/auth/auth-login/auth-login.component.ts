import { Component, ChangeDetectorRef } from '@angular/core';
import { Router , RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
})
export class AuthLoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // Necesario para forzar la actualización de la vista
  ) {}

  onSubmit() {
    this.submitted = true;
    this.errorMessage = ''; //validacion inmediata

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa ambos campos.';
      return;
    } //llamada al servicio de autenticacion

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        //respuesta exitosa redirijo al admin
        if (response?.access_token) {
          this.router.navigate(['/admin']);
        } else {
          this.errorMessage = 'Respuesta inesperada del servidor.';
        }
      },
      error: (err) => {
        //manejo errores del backend
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas.';
        } else if (err.status === 422) {
          this.errorMessage =
            'Error de validación: Email o contraseña mal formateados.';
        } else {
          this.errorMessage = 'Error del servidor, intente más tarde.';
        }
        //fuerzo la actualizacion de la vista, ya que me ocasionaba problemas
        this.cdr.detectChanges();
      },
    });
  }
}
