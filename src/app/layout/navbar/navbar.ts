import {
  Component,
  inject,
  output,
  signal,
  DestroyRef,
  HostListener,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    'body:scroll': 'onWindowScroll()',
  },
})
export class NavbarComponent {
  authService = inject(AuthService);

  loginClicked = output<void>();
  addSpotClicked = output<void>();

  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    console.log('Window scrolled:', window.scrollY);
    this.isScrolled.set(window.scrollY > 50);
  }
}
