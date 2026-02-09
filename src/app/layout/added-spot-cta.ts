import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/button';

@Component({
  selector: 'app-add-spot-cta',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="py-16 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>

        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Sevdiğin Bir Mekan Mı Var?
        </h2>
        
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Keşfettiğin harika mekanları topluluğumuzla paylaş. 
          Her paylaşım, başkalarının harika deneyimler yaşamasına yardımcı olur.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <app-button size="lg" class="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Hemen Mekan Ekle
          </app-button>
          
          <button class="inline-flex items-center gap-2 px-6 py-3 text-white hover:bg-white/10 rounded-lg font-semibold transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Nasıl Çalışır?
          </button>
        </div>

        <!-- Benefits -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Hızlı ve Kolay</h3>
            <p class="text-white/80 text-sm">Sadece birkaç dakikada mekan ekleyebilirsin</p>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Toplulukla Paylaş</h3>
            <p class="text-white/80 text-sm">Binlerce kişiye ulaş ve ilham ver</p>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Rozetler Kazan</h3>
            <p class="text-white/80 text-sm">Katkılarınla özel rozetler kazan</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class AddSpotCtaComponent {}