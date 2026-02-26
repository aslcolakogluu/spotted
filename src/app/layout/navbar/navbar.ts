import {
  Component,
  inject,
  output,
  signal,
  AfterViewInit,
  DestroyRef,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements AfterViewInit {
  authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  loginClicked = output<void>();
  addSpotClicked = output<void>();

  isScrolled = signal(false); 

  ngAfterViewInit(): void {
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(16, undefined, { leading: true, trailing: true }),
        map(() => window.scrollY > 100),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((scrolled) => this.isScrolled.set(scrolled));
  }

  /*@EventListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 100);
  }*/
}
