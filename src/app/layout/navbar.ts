import { Component, inject, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5" 
         style="background: linear-gradient(180deg, rgba(10,11,13,0.9) 0%, transparent 100%);">
      
      <!-- Logo -->
      <a routerLink="/" 
         class="cursor-pointer" 
         style="font-family: 'Playfair Display', serif; 
                font-size: 1.25rem; 
                letter-spacing: 0.02em; 
                color: #eee8df;
                text-decoration: none;">
        Spotted - <span style="color: #c8a96e;">In</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <a routerLink="/" 
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}"
           class="nav-btn">
          HOME
        </a>
        
        <a routerLink="/explore" 
           routerLinkActive="active"
           class="nav-btn">
          EXPLORE
        </a>
        
        <a routerLink="/map" 
           routerLinkActive="active"
           class="nav-btn">
          MAP
        </a>
        
        <a routerLink="/about" 
           routerLinkActive="active"
           class="nav-btn">
          ABOUT
        </a>
      </div>

      <!-- Actions (Right Side) -->
      <div class="flex items-center gap-4">
        @if (!authService.isAuthenticated()) { 
          <button 
            (click)="loginClicked.emit()" 
            class="nav-btn-primary"> 
            LOGIN
          </button>
        }
        
        @if (authService.isAuthenticated()) { 
          <button 
            (click)="addSpotClicked.emit()" 
            class="nav-btn-primary">
            + ADD SPOT
          </button>
        }

        <!-- Mobile Menu Button -->
        <button class="md:hidden" 
                style="color: rgba(238,232,223,0.45); 
                       background: none; 
                       border: none; 
                       cursor: pointer;">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16">
            </path>
          </svg>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .nav-btn {
      font-size: 0.82rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(238, 232, 223, 0.45);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.25s;
      text-decoration: none;
      display: inline-block;
    }

    .nav-btn:hover {
      color: #c8a96e;
    }

    .nav-btn.active {
      color: #c8a96e;
      font-weight: 600;
    }

    .nav-btn-primary {
      background: #c8a96e;
      color: #0a0b0d;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: all 0.25s;
    }

    .nav-btn-primary:hover {
      background: #d9bf84;
      transform: translateY(-1px);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);  // AuthService, kullanıcının kimlik doğrulama durumunu kontrol etmek için kullanılır, böylece navbar'da kullanıcı giriş yapmışsa + Add Spot butonu gösterilir, giriş yapmamışsa Login butonu gösterilir
  loginClicked = output<void>(); // Login butonuna tıklandığında tetiklenen EventEmitter, böylece kullanıcı giriş yapmaya çalıştığında gerekli işlemler gerçekleştirilir
  addSpotClicked = output<void>(); // + Add Spot butonuna tıklandığında tetiklenen EventEmitter, böylece kullanıcı yeni bir spot eklemek istediğinde gerekli işlemler gerçekleştirilir
}