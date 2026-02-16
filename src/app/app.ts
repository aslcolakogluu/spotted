import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './layout/navbar';
import { FooterComponent } from './layout/footer';
import { HeroComponent } from './layout/hero';
import { FeaturedSpotComponent } from './layout/featured-spots';
import { MapActivitySectionComponent} from './features/components/map-activity';
import { AddSpotCtaComponent } from './layout/added-spot-cta';
import { Login } from './features/login/login';

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
    Login
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  showLoginModal = signal(false);
  currentRoute = signal('/');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.url);
    });
  }

  isHomePage(): boolean {
    return this.currentRoute() === '/' || this.currentRoute() === '';
  }

  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  handleAddSpotClick(): void {
    this.router.navigate(['/add-spot']);
  }
}