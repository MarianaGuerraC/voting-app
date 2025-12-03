import { Routes } from '@angular/router';

import { AuthLoginComponent } from './components/auth/auth-login/auth-login.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { VoterFormComponent } from './components/voter/voter-form/voter-form.component';
import { VoterListComponent } from './components/voter/voter-list/voter-list.component';
import { VoteFormComponent } from './components/vote/vote-form/vote-form.component';
import { ResultsComponent } from './components/vote/results/results.component';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  //pantalla de votacion, ruta por defecto
  { path: '', redirectTo: 'vote-form', pathMatch: 'full' },
  
  //votacion y resultados, publicos
  { path: 'vote-form', component: VoteFormComponent, title: 'Votación' },
  { path: 'results', component: ResultsComponent, title: 'Resultados' },

  //ruta unica de login
  { path: 'login', component: AuthLoginComponent, title: 'Login' },

  //rutas protegidas
  { 
    path: 'admin', 
    component: AdminPanelComponent, 
    title: 'Panel Admin',
    canActivate: [authGuard]
  },
  { 
    path: 'voter-form', 
    component: VoterFormComponent, 
    title: 'Agregar Votante',
    canActivate: [authGuard]
  },
  { 
    path: 'voter-list', 
    component: VoterListComponent, 
    title: 'Listado Votantes',
    canActivate: [authGuard]
  },

  //envia a cualquier ruta no reconocida al Login
  { path: '**', redirectTo: 'login' },
];