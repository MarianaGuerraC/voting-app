// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';

// 🚨 CORRECCIÓN DE RUTAS DE IMPORTACIÓN (Path completo para los componentes)
import { AuthLoginComponent } from './components/auth/auth-login/auth-login.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { VoterFormComponent } from './components/voter/voter-form/voter-form.component';
import { VoterListComponent } from './components/voter/voter-list/voter-list.component';
import { VoteFormComponent } from './components/vote/vote-form/vote-form.component';
import { ResultsComponent } from './components/vote/results/results.component';

export const routes: Routes = [
  // Ruta por defecto: Pantalla de Votación (Principal)
  { path: '', redirectTo: 'vote-form', pathMatch: 'full' },
  
  // Rutas Públicas (Votación y Resultados)
  { path: 'vote-form', component: VoteFormComponent, title: 'Votación' },
  { path: 'results', component: ResultsComponent, title: 'Resultados' },

  // Rutas de Administración (Requieren login)
  { path: 'login', component: AuthLoginComponent, title: 'Login' },
  { path: 'admin', component: AdminPanelComponent, title: 'Panel Admin' },
  { path: 'voter-form', component: VoterFormComponent, title: 'Agregar Votante' },
  { path: 'voter-list', component: VoterListComponent, title: 'Listado Votantes' },

  // Wildcard (maneja URLs no encontradas)
  { path: '**', redirectTo: 'vote-form' },
];