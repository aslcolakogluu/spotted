// Login (giriş) bileşeni — kullanıcının e-posta ve şifre ile giriş yapmasını sağlar
// Hem ana sayfadaki modal olarak hem de /login rotasında standalone sayfa olarak kullanılır
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
  imports: [ReactiveFormsModule, RouterLink], // ReactiveFormsModule: form validasyonu için, RouterLink: şifre-kayıt linkleri için
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService); // Kimlik doğrulama işlemleri için AuthService enjekte edildi
  private router = inject(Router);   // Giriş sonrası yönlendirme için Router enjekte edildi
  closeModal = output<void>();       // Parent bileşene modal kapatma sinyali gönderir
  fb: FormBuilder = inject(FormBuilder); // Reactive form oluşturmak için FormBuilder enjekte edildi

  // Giriş formu: e-posta ve şifre alanları validasyon kurallarıyla tanımlandı
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // E-posta formatı zorunlu
    password: ['', [Validators.required, Validators.minLength(6)]], // Minimum 6 karakter
  });

  isLoading = signal(false);  // Form gönderilirken yükleniyor durumunu tutar
  errorMessage = signal('');  // Hata mesajını reaktif olarak tutar

  ngOnInit(): void {
    // Form değişikliklerini izlemek için kullanılabilir (şu an boş)
  }

  // Kullanıcı giriş sayfasını kapatmak istediğinde ana sayfaya yönlendirir
  closeLogin(): void {
    this.router.navigate(['/']);
  }

  // Form gönderildiğinde çalışır — AuthService üzerinden giriş yapılmaya çalışılır
  onSubmit() {
    this.isLoading.set(true);    // Yükleniyor durumunu aktif et
    this.errorMessage.set('');   // Önceki hata mesajını temizle

    this.authService
      .login(this.loginForm.value as LoginForm)
      .subscribe((res) => {
        this.isLoading.set(false); // Yanıt gelince yükleniyor durumunu kapat
        if (res) {
          this.router.navigate(['/']); // Başarılı girişte ana sayfaya yönlendir
        } else {
          this.errorMessage.set(
            'Login failed. Please check your credentials and try again.',
          );
        }
      });
  }

  // Kayıt sayfasına yönlendirme — önce modal kapatılır, sonra /register rotasına gidilir
  goToRegister(): void {
    this.closeModal.emit(); // Modal'ı kapat
    this.router.navigate(['/register']);
  }
}
