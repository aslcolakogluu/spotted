import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Spotted In
            </span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a href="#" class="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Keşfet
            </a>
            <a href="#" class="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Harita
            </a>
            <a href="#" class="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Mekanlar
            </a>
            <a href="#" class="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Hakkında
            </a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button class="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="font-medium">Ara</span>
            </button>
            
            <app-button variant="primary" size="sm">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Mekan Ekle
            </app-button>

            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {}