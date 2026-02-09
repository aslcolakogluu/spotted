import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5" style="background: linear-gradient(180deg, rgba(10,11,13,0.9) 0%, transparent 100%);">
      <!-- Logo -->
      <div class="cursor-pointer" style="font-family: 'Playfair Display', serif; font-size: 1.25rem; letter-spacing: 0.02em; color: #eee8df;">
        Spotted -  <span style="color: #c8a96e;">In</span>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <button class="nav-btn" style="font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(238,232,223,0.45); background: none; border: none; cursor: pointer; transition: color 0.25s;">Explore</button>
        <button class="nav-btn" style="font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(238,232,223,0.45); background: none; border: none; cursor: pointer; transition: color 0.25s;">Map</button>
        <button class="nav-btn" style="font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(238,232,223,0.45); background: none; border: none; cursor: pointer; transition: color 0.25s;">Spots</button>
        <button class="nav-btn" style="font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(238,232,223,0.45); background: none; border: none; cursor: pointer; transition: color 0.25s;">About</button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button class="nav-btn-primary" style="background: #c8a96e; color: #0a0b0d; padding: 8px 18px; border-radius: 6px; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.25s;">+ Add Spot</button>

        <!-- Mobile Menu Button -->
        <button class="md:hidden" style="color: rgba(238,232,223,0.45); background: none; border: none; cursor: pointer;">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>

    <style>
      .nav-btn:hover {
        color: #c8a96e;
      }
      .nav-btn-primary:hover {
        background: #d9bf84;
      }
    </style>
  `,
  styles: []
})
export class NavbarComponent {}