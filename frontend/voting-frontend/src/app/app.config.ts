import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router'; 
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { routes } from './app.routes'; 
import { authInterceptor } from './services/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    FormBuilder,
    importProvidersFrom(ReactiveFormsModule), 
    
    provideRouter(
      routes,
      withComponentInputBinding() 
    ), 
    
    provideHttpClient(
      withInterceptors([authInterceptor])
    ) 
  ]
};