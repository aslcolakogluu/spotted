import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isSubmitting = false;

  onSubmit(): void {
    this.errorMessage = '';

    // Validation
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isSubmitting = true;

    // Mock register (gerçek API entegrasyonu için değiştirilecek)
    const success = this.authService.register(
      this.name,
      this.email,
      this.password,
    );

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'This email is already registered';
      this.isSubmitting = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  closeRegister(): void {
    this.router.navigate(['/']);
  }
}
