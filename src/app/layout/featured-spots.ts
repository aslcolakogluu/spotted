import { Component, OnInit, signal } from '@angular/core';
import { SpotService } from '@core/services';
import { Spot } from '@core/models';
import { SpotCardComponent } from '@shared/spot-card';

@Component({
  selector: 'app-featured-spot',
  standalone: true,
  imports: [SpotCardComponent],
  template: `
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span class="text-sm font-semibold text-yellow-800">Öne Çıkan Mekanlar</span>
          </div>
          
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bu Hafta En Popüler Mekanlar
          </h2>
          
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Topluluğumuz tarafından en çok beğenilen ve ziyaret edilen mekanları keşfedin
          </p>
        </div>

        <!-- Featured Spots Grid -->
        @if (featuredSpots().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (spot of featuredSpots(); track spot.id) {
              <app-spot-card 
                [spot]="spot"
                (spotClick)="onSpotClick($event)">
              </app-spot-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Henüz öne çıkan mekan yok</h3>
            <p class="text-gray-600">İlk öne çıkan mekanı ekleyin!</p>
          </div>
        }

        <!-- View All Button -->
        @if (featuredSpots().length > 0) {
          <div class="text-center mt-12">
            <button class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Tüm Mekanları Gör
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: []
})
export class FeaturedSpotComponent implements OnInit {
  featuredSpots = signal<Spot[]>([]);

  constructor(private spotService: SpotService) {}

  ngOnInit(): void {
    this.spotService.getFeaturedSpots().subscribe((spots: Spot[]) => {
      this.featuredSpots.set(spots);
    });
  }

  onSpotClick(spot: Spot): void {
    console.log('Spot clicked:', spot);
    // Navigate to spot detail page
  }
}