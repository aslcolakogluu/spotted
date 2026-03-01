import { Component, output, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { LoginForm } from '@core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  private router = inject(Router);
  closeModal = output<void>();
  fb: FormBuilder = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    // Form value changes tracking
  }

  closeLogin(): void {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .login(this.loginForm.value as LoginForm)
      .subscribe((res) => {
        this.isLoading.set(false);
        if (res) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set(
            'Login failed. Please check your credentials and try again.',
          );
        }
      });
  }

  // ✅ Register sayfasına git
  goToRegister(): void {
    this.closeModal.emit(); // Modal'ı kapat
    this.router.navigate(['/register']);
  }
}
