// frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 

// 🚨 IMPORTANTE: Asumimos que vas a crear/recrear este archivo a continuación.
import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Habilita el sistema de enrutamiento de Angular
    provideRouter(routes), 
    
    // 2. Habilita el módulo HttpClient para hacer llamadas a la API (FastAPI)
    provideHttpClient() 
  ]
};