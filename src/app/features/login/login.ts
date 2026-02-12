import { Component, output , signal, inject} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { LoginForm } from '@core/models/user.model';

@Component({
  selector: 'app-login', 
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService); 
  closeModal = output<void>(); // modal kapanır

  fb: FormBuilder = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(6)]] 
  });

  isLoading = signal(false); // yükleniyor gösterir
  errorMessage = signal(''); 

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe((value: any) => {
      console.log('Login form value changed:', value);
    });

    console.log('Login component initialized with form:', this.loginForm.valueChanges);
  }

  async onSubmit() {
    this.isLoading.set(true); 
    this.errorMessage.set('');

    console.log('Login form submitted with:', this.loginForm);

    try { 
      await this.authService.login(this.loginForm.value as LoginForm);
      this.closeModal.emit(); 
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set('Login failed. Please check your credentials and try again.');
    } finally {
      this.isLoading.set(false);
    } 
  
  }



}
