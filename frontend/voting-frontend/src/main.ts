// frontend/src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // <-- Importa la configuración
import { AppComponent } from './app/app.component'; // <-- El componente raíz

bootstrapApplication(AppComponent, appConfig)
  .catch((err: any) => console.error(err));