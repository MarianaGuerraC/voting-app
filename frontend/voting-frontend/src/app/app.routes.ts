import { Routes } from '@angular/router';

import { AuthLoginComponent } from './components/auth/auth-login/auth-login.component';
import { AdminPanelComponent } from './components/admin/admin-panel.component';
import { AdminChangePasswordComponent } from './components/admin/admin-change-password/admin-change-password.component';
import { VoterFormComponent } from './components/voter/voter-form.component';
import { VoteFormComponent } from './components/vote/vote-form/vote-form.component';
import { ResultsComponent } from './components/vote/results/results.component';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  //Ruta por defecto a votación
  { path: '', redirectTo: 'vote-form', pathMatch: 'full' },

  //Publicas: votación y resultados
  { path: 'vote-form', component: VoteFormComponent, title: 'Votación' },
  { path: 'results', component: ResultsComponent, title: 'Resultados' },

  //Login
  { path: 'login', component: AuthLoginComponent, title: 'Login' },

  //Admin con layout comun
  { 
    path: 'admin', 
    component: AdminPanelComponent, 
    title: 'Panel Admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'voter-form',           //crear votante/candidato
        component: VoterFormComponent,
        title: 'Agregar Votante'
      },
      {
        path: 'voter-form/:id',       //editar votante/candidato
        component: VoterFormComponent,
        title: 'Editar Votante'
      },
      {
        path: 'change-password',      //cambiar contraseña del admin
        component: AdminChangePasswordComponent,
        title: 'Cambiar Contraseña'
      },
      {
        path: '',                     //redirigir al panel principal si solo /admin
        redirectTo: 'voter-form',
        pathMatch: 'full'
      }
    ]
  },

  // Cualquier ruta desconocida → login
  { path: '**', redirectTo: 'login' }
];
