import { Component, output, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  private router = inject(Router);
  closeModal = output<void>(); // Login başarılı olduğunda modal'ı kapatmak için kullanılan EventEmitter, böylece kullanıcı giriş yaptıktan sonra modal otomatik olarak kapanır

  fb: FormBuilder = inject(FormBuilder); // FormBuilder servisi, Reactive Forms oluşturmak için kullanılır, böylece form kontrolü ve doğrulama işlemleri daha kolay yönetilir

  loginForm = this.fb.group({
    // Login formu oluşturulur, email ve password alanları tanımlanır ve doğrulama kuralları eklenir, böylece kullanıcı geçerli bilgilerle giriş yapmaya zorlanır
    email: ['', [Validators.required, Validators.email]], // Email alanı için doğrulama kuralları, kullanıcı geçerli bir email adresi girmelidir, böylece yanlış formatta email'lerin kabul edilmesi engellenir
    password: ['', [Validators.required, Validators.minLength(6)]], // Password alanı için doğrulama kuralları, kullanıcı en az 6 karakter uzunluğunda bir şifre girmelidir, böylece zayıf şifrelerin kabul edilmesi engellenir
  });

  isLoading = signal(false); // yükleniyor gösterir
  errorMessage = signal('');

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe((value: any) => {
      // Login formundaki değerler değiştiğinde tetiklenen abonelik, formun geçerli olup olmadığını kontrol eder ve hata mesajını günceller, böylece kullanıcı anında form doğrulama geri bildirimi alır
      console.log('Login form value changed:', value);
    });

    console.log(
      'Login component initialized with form:',
      this.loginForm.valueChanges,
    );
  }

  closeLogin(): void {
    this.router.navigate(['/']);
  }

  onSubmit() {
    // Login formu gönderildiğinde çağrılan fonksiyon, formun geçerli olup olmadığını kontrol eder, yükleniyor durumunu günceller ve AuthService üzerinden login işlemini başlatır, böylece kullanıcı giriş yapmaya çalıştığında gerekli işlemler gerçekleştirilir
    this.isLoading.set(true);
    this.errorMessage.set('');

    console.log('Login form submitted with:', this.loginForm);

    this.authService
      .login(this.loginForm.value as LoginForm)
      .subscribe((res) => {
        // AuthService'in login metodundan dönen Observable'a abone olunur, login işlemi tamamlandığında sonuç alınır ve buna göre işlem yapılır, böylece kullanıcı giriş yapmaya çalıştığında başarılı veya başarısız durumlara uygun geri bildirim sağlanır
        this.isLoading.set(false);

        if (res) {
          this.router.navigate(['/']); // Login başarılı ise, anasayfaya yönlendir
        } else {
          this.errorMessage.set(
            // Hata mesajı gösterilir, böylece kullanıcı başarısız giriş denemesinde neyin yanlış olduğunu öğrenir
            'Login failed. Please check your credentials and try again.',
          );
        }
      });
  }
}
