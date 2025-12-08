import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';
import { VoterFormComponent } from '../voter/voter-form.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    AdminChangePasswordComponent,
    VoterFormComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent {
  selectedTab: string = '';

  constructor(private authService: AuthService, public router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
