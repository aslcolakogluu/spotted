import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Şehrini Keşfet,
            <br/>
            <span class="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Deneyimlerini Paylaş
            </span>
          </h1>
          
          <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            En sevdiğin mekanları keşfet, yorumla ve topluluğumuzla paylaş. 
            Şehrindeki gizli kalmış harika yerleri ortaya çıkar.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <app-button variant="primary" size="lg" class="bg-white text-indigo-600 hover:bg-gray-100">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Mekanları Keşfet
            </app-button>
            
            <app-button variant="outline" size="lg" class="border-white text-white hover:bg-white/10">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Mekan Ekle
            </app-button>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div class="text-3xl font-bold text-white mb-2">1,247</div>
              <div class="text-white/80 text-sm">Mekan</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div class="text-3xl font-bold text-white mb-2">8,934</div>
              <div class="text-white/80 text-sm">Kullanıcı</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div class="text-3xl font-bold text-white mb-2">5,621</div>
              <div class="text-white/80 text-sm">Yorum</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div class="text-3xl font-bold text-white mb-2">23K+</div>
              <div class="text-white/80 text-sm">Ziyaret</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  `,
  styles: []
})
export class HeroComponent {}