import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService, RegisterData } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // State management
  isLoading = this.authService.isLoading;
  isRegistering = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  // Registration form
  registerForm: FormGroup = this.fb.group({
    firstName: ['', [
      Validators.required, 
      Validators.minLength(2)
      // Removed strict pattern to allow more name formats
    ]],
    lastName: ['', [
      Validators.required, 
      Validators.minLength(2)
      // Removed strict pattern to allow more name formats
    ]],
    username: ['', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(20)
      // Removed strict pattern to allow more flexibility
    ]],
    email: ['', [
      Validators.required, 
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8)
      // Removed strict password strength validator to make registration easier
    ]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, { 
    validators: this.passwordMatchValidator 
  });

  // Computed properties
  canSubmit = computed(() => 
    this.registerForm.get('firstName')?.valid && 
    this.registerForm.get('lastName')?.valid && 
    this.registerForm.get('username')?.valid && 
    this.registerForm.get('email')?.valid && 
    this.registerForm.get('password')?.value?.length >= 8 && 
    this.registerForm.get('confirmPassword')?.value === this.registerForm.get('password')?.value &&
    this.registerForm.get('acceptTerms')?.value === true &&
    !this.isLoading() && 
    !this.isRegistering()
  );

  constructor() {
    // Form is initialized above
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
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    confirmPassword?.setErrors(null);
    return null;
  }

  // Form submission
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isRegistering.set(true);
      
      const registerData: RegisterData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: (user) => {
          this.snackBar.open(
            `Welcome ${user.firstName}! Your account has been created successfully.`, 
            'Close', 
            {
              duration: 5000,
              panelClass: ['success-snackbar']
            }
          );
          this.isRegistering.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          let errorMessage = 'Registration failed. Please try again.';
          
          if (error.message.includes('already exists')) {
            errorMessage = 'An account with this email or username already exists.';
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isRegistering.set(false);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Navigation
  onLoginClick(): void {
    this.router.navigate(['/auth/login']);
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  // Helper methods
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must not exceed ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return this.getPatternErrorMessage(fieldName);
    }
    // Removed passwordStrength error as we simplified validation
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return displayNames[fieldName] || fieldName;
  }

  private getPatternErrorMessage(fieldName: string): string {
    switch (fieldName) {
      case 'email':
        return 'Please enter a valid email address';
      default:
        return 'Invalid format';
    }
  }

  getPasswordStrengthIndicator(): { strength: number; label: string; color: string } {
    const password = this.registerForm.get('password')?.value || '';
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
