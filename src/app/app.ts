import { Component, signal, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './layout/navbar/navbar';
import { FooterComponent } from './layout/footer/footer';
import { HeroComponent } from './layout/hero/hero';
import { FeaturedSpotComponent } from './layout/featured-spots/featured-spots';
import { MapActivitySectionComponent } from './features/components/map-activity/map-activity';
import { AddSpotCtaComponent } from './layout/added-spot-cta/added-spot-cta';
import { Login } from './features/login/login';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    FeaturedSpotComponent,
    MapActivitySectionComponent,
    AddSpotCtaComponent,
    Login,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  private authService = inject(AuthService);
  showLoginModal = signal(false);
  currentRoute = signal('/');

  constructor(private router: Router) {
    // Router, Angular'ın yönlendirme işlemlerini yönetmek için kullanılan bir servis, böylece uygulama içinde farklı sayfalara geçiş yapılabilir
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd), // Router'ın NavigationEnd olaylarını filtreler, böylece sadece sayfa geçişi tamamlandığında currentRoute güncellenir, bu sayede uygulamanın hangi sayfada olduğunu doğru bir şekilde takip edebiliriz
      )
      .subscribe((event: any) => {
        // NavigationEnd olayları gerçekleştiğinde currentRoute sinyalini günceller, böylece uygulamanın hangi sayfada olduğunu doğru bir şekilde takip edebiliriz
        this.currentRoute.set(event.url); // Router'ın NavigationEnd olayları gerçekleştiğinde currentRoute sinyalini günceller, böylece uygulamanın hangi sayfada olduğunu doğru bir şekilde takip edebiliriz
      });
  }

  isHomePage(): boolean {
    return this.currentRoute() === '/' || this.currentRoute() === ''; // currentRoute sinyalinin değeri '/' veya '' ise true döner, böylece uygulamanın ana sayfada olup olmadığını kontrol edebiliriz
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openLoginModal(): void {
    this.showLoginModal.set(true); // showLoginModal sinyalini true yaparak login modal'ını açar, böylece kullanıcı giriş yapmak istediğinde modal görünür hale gelir
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false); // showLoginModal sinyalini false yaparak login modal'ını kapatır, böylece kullanıcı giriş yaptıktan sonra modal kapanır veya kullanıcı modal'ı kapatmak istediğinde modal görünmez hale gelir
  }

  handleAddSpotClick(): void {
    this.router.navigate(['/add-spot']); // Router'ı kullanarak '/add-spot' rotasına yönlendirir, böylece kullanıcı "Add Spot" butonuna tıkladığında ilgili sayfaya geçiş yapabilir
  }
}
