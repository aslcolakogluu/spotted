// Kayıt (register) bileşeni — yeni kullanıcıların hesap oluşturmasını sağlar
// /register rotasında çalışır ve AuthService üzerinden kullanıcıyı localStorage'a kaydeder
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Template driven form için FormsModule import edildi
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private authService = inject(AuthService); // Kayıt işlemi için AuthService enjekte edildi
  private router = inject(Router);           // Kayıt sonrası yönlendirme için Router enjekte edildi

  // Form alanları — template-driven yaklaşımla [(ngModel)] ile bağlanır
  name = '';
  email = '';
  password = '';
  confirmPassword = '';    // Şifre tekrar doğrulama alanı
  errorMessage = '';       // Validasyon veya kayıt hatası mesajı
  isSubmitting = false;    // Form gönderilirken butonun tekrar tıklanmasını engeller

  // Form gönderildiğinde çalışır — validasyon sonrası AuthService'e kayıt isteği gönderilir
  onSubmit(): void {
    this.errorMessage = ''; // Önceki hata mesajını temizle

    // Tüm alanların dolu olup olmadığını kontrol et
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    // Şifre ve şifre tekrarının eşleşip eşleşmediğini kontrol et
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Minimum şifre uzunluğu kontrolü
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isSubmitting = true; // Gönderme durumunu aktive et

    // Mock register (gerçek API entegrasyonu için değiştirilecek)
    // AuthService.register() localStorage'a yeni kullanıcı ekler ve otomatik giriş yapar
    const success = this.authService.register(
      this.name,
      this.email,
      this.password,
    );

    if (success) {
      this.router.navigate(['/']); // Başarılı kayıt sonrası ana sayfaya yönlendir
    } else {
      this.errorMessage = 'This email is already registered'; // E-posta zaten kayıtlıysa hata göster
      this.isSubmitting = false;
    }
  }

  // Giriş sayfasına yönlendirme
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Kayıt formunu kapatıp ana sayfaya dönme
  closeRegister(): void {
    this.router.navigate(['/']);
  }
}
