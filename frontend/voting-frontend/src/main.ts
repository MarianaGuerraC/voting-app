import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // imposta la config
import { AppComponent } from './app/app.component'; //componente raiz

bootstrapApplication(AppComponent, appConfig)
  .catch((err: any) => console.error(err));