// src/app/components/admin/admin-change-password/admin-change-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.css']
})
export class AdminChangePasswordComponent {
  passwordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService,  private cdr: ChangeDetectorRef) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  submit(): void {
  this.errorMessage = null;
  this.successMessage = null;
  this.cdr.detectChanges();

  if (this.passwordForm.invalid) {
    this.errorMessage = 'Please fill in all fields.';
    this.cdr.detectChanges();
    return;
  }

  const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;

  if (newPassword !== confirmPassword) {
    this.errorMessage = 'New passwords do not match.';
    this.cdr.detectChanges();
    return;
  }

  this.adminService.changePassword({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword })
    .subscribe({
      next: () => {
        this.successMessage = 'Password updated successfully!';
        this.passwordForm.reset();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = err.error?.detail || 'Error updating password.';
        this.cdr.detectChanges();
      }
    });
}
}
