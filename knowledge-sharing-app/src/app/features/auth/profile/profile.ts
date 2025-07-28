import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService, User } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSlideToggleModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  // State management
  currentUser = this.authService.currentUser;
  isLoading = signal(false);
  isSaving = signal(false);

  // Form groups
  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: [{ value: '', disabled: true }] // Role is read-only for users
  });
  
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [
      Validators.required, 
      Validators.minLength(8),
      this.passwordStrengthValidator
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  preferencesForm: FormGroup = this.fb.group({
    theme: ['light'],
    emailNotifications: [true],
    pushNotifications: [true],
    weeklyDigest: [true],
    language: ['en'],
    timezone: ['UTC']
  });

  // Computed properties
  hasChanges = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    
    const formValues = this.profileForm.value;
    return (
      formValues.firstName !== user.firstName ||
      formValues.lastName !== user.lastName ||
      formValues.email !== user.email ||
      formValues.username !== user.username
    );
  });

  // Role enum for template
  UserRole = UserRole;

  constructor() {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading.set(true);
    
    const user = this.currentUser();
    if (user) {
      // Populate profile form
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role
      });

      // Load user preferences (mock data for now)
      this.preferencesForm.patchValue({
        theme: 'light',
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        language: 'en',
        timezone: 'UTC'
      });
    }
    
    this.isLoading.set(false);
  }

  // Custom validators
  private passwordStrengthValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;
    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    confirmPassword?.setErrors(null);
    return null;
  }

  // Form submission methods
  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      
      const updateData = {
        ...this.profileForm.value,
        role: undefined // Remove role from update data
      };

      // Simulate API call
      setTimeout(() => {
        this.authService.updateProfile(updateData).subscribe({
          next: (updatedUser) => {
            this.snackBar.open('Profile updated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.isSaving.set(false);
          },
          error: (error) => {
            this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            this.isSaving.set(false);
          }
        });
      }, 1000);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.isSaving.set(true);
      
      const { currentPassword, newPassword } = this.passwordForm.value;
      
      // Simulate API call for password change
      setTimeout(() => {
        // Mock password validation
        this.snackBar.open('Password changed successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.passwordForm.reset();
        this.isSaving.set(false);
      }, 1000);
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  onUpdatePreferences(): void {
    if (this.preferencesForm.valid) {
      this.isSaving.set(true);
      
      // Simulate API call for preferences update
      setTimeout(() => {
        this.snackBar.open('Preferences updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isSaving.set(false);
      }, 1000);
    }
  }

  onResetForm(): void {
    this.loadUserData();
    this.snackBar.open('Form reset to original values', 'Close', {
      duration: 2000
    });
  }

  onDeleteAccount(): void {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      this.isLoading.set(true);
      
      // Simulate account deletion
      setTimeout(() => {
        this.snackBar.open('Account deletion requested. You will be contacted shortly.', 'Close', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        this.isLoading.set(false);
      }, 1000);
    }
  }

  // Helper methods
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('passwordStrength')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.EDITOR:
        return 'Editor';
      case UserRole.VIEWER:
        return 'Viewer';
      default:
        return role;
    }
  }

  getPasswordStrengthIndicator(): { strength: number; label: string; color: string } {
    const password = this.passwordForm.get('newPassword')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[#?!@$%^&*-]/.test(password)) strength++;

    const indicators = [
      { strength: 0, label: 'Very Weak', color: '#f44336' },
      { strength: 1, label: 'Weak', color: '#ff9800' },
      { strength: 2, label: 'Fair', color: '#ff9800' },
      { strength: 3, label: 'Good', color: '#2196f3' },
      { strength: 4, label: 'Strong', color: '#4caf50' },
      { strength: 5, label: 'Very Strong', color: '#4caf50' }
    ];

    return indicators[strength];
  }
}
