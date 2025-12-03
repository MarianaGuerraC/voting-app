import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  //sintaxis moderna de Angular
  const authService = inject(AuthService);
  const router = inject(Router);

  //verifico la sesion
  if (authService.getToken()) {
    //si tiene token permite el acceso
    return true; 
  } else {
    //si el usuario no tiene token redirige al login
    router.navigate(['/login']);
    return false;
  }
};