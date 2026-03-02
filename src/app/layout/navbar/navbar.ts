// Navbar (üst gezinme çubuğu) bileşeni — tüm sayfalarda görüntülenir
// Scroll pozisyonuna göre görünümü dinamik olarak değişir (glassmorphism efekti)
import {
  Component,
  inject,
  output,
  signal,
  HostListener,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // RouterLink: navigasyon linkleri, RouterLinkActive: aktif rota stillemesi için
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    'body:scroll': 'onWindowScroll()', // Alternatif scroll dinleme metodu
  },
})
export class NavbarComponent {
  authService = inject(AuthService); // Kullanıcı oturum durumuna göre login/logout butonunu gösterir

  // Parent bileşene olay bildirimi yapmak için output sinyalleri
  loginClicked = output<void>();    // Login butonuna tıklandığında parent bileşeni bilgilendirir
  addSpotClicked = output<void>();  // Add Spot butonuna tıklandığında parent bileşeni bilgilendirir

  isScrolled = signal(false); // Sayfa 50px aşağı kaydırıldığında navbar arka plan efektini tetikler

  // Pencere scroll olayını dinler — 50px eşiği aşıldığında navbar görünümü değişir
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50); // true: scrolled, false: en üstte
  }
}
