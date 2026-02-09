import { Component, OnInit, signal } from '@angular/core';
import { SpotService } from '@core/services';
import { Spot } from '@core/models';

@Component({
  selector: 'app-featured-spot',
  standalone: true,
  imports: [],
  template: `
    <section class="px-12 py-18">
      <div class="flex justify-between items-end mb-10">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 600; color: #eee8df;">
          This week's <em style="font-style: italic; color: #c8a96e;">Featured Spot</em>
        </h2>
      </div>

      <!-- Featured Spot (Big Card) -->
      @if (featuredSpots().length > 0) {
        <div class="relative overflow-hidden mb-12 cursor-pointer" style="border-radius: 16px; height: 420px; background: linear-gradient(135deg, #1c2a35 0%, #162028 50%, #1a1520 100%);">
          <div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 40% at 30% 50%, rgba(40,60,80,0.3) 0%, transparent 70%), radial-gradient(ellipse 50% 35% at 75% 45%, rgba(60,40,60,0.2) 0%, transparent 70%);"></div>
          
          <div class="absolute top-6 left-6 px-4 py-2" style="background: rgba(200,169,110,0.15); border: 1px solid rgba(200,169,110,0.3); border-radius: 20px; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #c8a96e;">
            ★ This week's featured spot
          </div>
          
          <div class="absolute bottom-8 left-8 right-8 z-10">
            <div class="flex gap-4 mb-3 text-sm">
              <span style="color: rgba(238,232,223,0.45);"> {{ featuredSpots()[0].type }}</span>
              <span style="color: rgba(238,232,223,0.45);">
                <span style="color: #c8a96e;">★★★★★</span> {{ featuredSpots()[0].rating.toFixed(1) }}
              </span>
            </div>
            <h3 style="font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 600; color: #eee8df; margin-bottom: 12px;">
              {{ featuredSpots()[0].name }}
            </h3>
            <p style="font-size: 0.95rem; line-height: 1.6; color: rgba(238,232,223,0.45); max-width: 600px; margin-bottom: 16px;">
              {{ featuredSpots()[0].description }}
            </p>
            <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5" style="background: rgba(111,191,130,0.15); border: 1px solid rgba(111,191,130,0.2); border-radius: 16px; font-size: 0.8rem; color: #6fbf82;">
              Best Hour: {{ featuredSpots()[0].openingHours }}
            </div>
          </div>
        </div>
      }

      <!-- Filter Bar -->
      <div class="flex gap-2.5 flex-wrap mb-9">
        <button class="filter-chip active">All Spots</button>
        <button class="filter-chip"> Scenic View</button>
        <button class="filter-chip"> Park</button>
        <button class="filter-chip"> Bridge</button>
        <button class="filter-chip"> Isolated Road</button>
        <button class="filter-chip"> Balcony</button>
        <button class="filter-chip"> Historical</button>
      </div>

      <!-- Spot Grid -->
      @if (featuredSpots().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (spot of featuredSpots(); track spot.id) {
            <div class="spot-card" (click)="onSpotClick(spot)">
              <div class="relative overflow-hidden" style="height: 200px;">
                <div class="absolute inset-0 card-img-bg" style="background: linear-gradient(135deg, #2a3540 0%, #1a2028 100%); transition: transform 0.3s;"></div>
                <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent 0%, rgba(10,11,13,0.6) 100%);"></div>
                <span class="absolute top-3 right-3 px-3 py-1" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border-radius: 12px; font-size: 0.7rem; font-weight: 500; color: #eee8df; border: 1px solid rgba(255,255,255,0.1);">
                  {{ getSpotIcon(spot.type) }} {{ spot.type }}
                </span>
              </div>
              <div class="p-4">
                <h4 style="font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; color: #eee8df; margin-bottom: 6px;">{{ spot.name }}</h4>
                <p style="font-size: 0.8rem; color: rgba(238,232,223,0.45); margin-bottom: 12px;">{{ spot.address }}</p>
                <div class="flex justify-between items-center text-sm">
                  <span style="color: rgba(238,232,223,0.45);">
                    <span style="color: #c8a96e;">{{ getStars(spot.rating) }}</span> {{ spot.rating.toFixed(1) }}
                  </span>
                  <span style="color: rgba(238,232,223,0.45); font-size: 0.75rem;">{{ spot.openingHours }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p style="color: rgba(238,232,223,0.45);">There are no featured spots yet.</p>
        </div>
      }
    </section>

    <style>
      .filter-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.06);
        background: rgba(255,255,255,0.05);
        color: rgba(238,232,223,0.45);
        font-size: 0.82rem;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .filter-chip:hover {
        border-color: #c8a96e;
        color: #eee8df;
      }
      
      .filter-chip.active {
        background: rgba(200,169,110,0.15);
        border-color: rgba(200,169,110,0.35);
        color: #c8a96e;
      }
      
      .spot-card {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        background: #12141a;
        border: 1px solid rgba(255,255,255,0.06);
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .spot-card:hover {
        background: #181c26;
        border-color: rgba(200,169,110,0.2);
        transform: translateY(-2px);
      }
      
      .spot-card:hover .card-img-bg {
        transform: scale(1.05);
      }
    </style>
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
  }

  getSpotIcon(type: string): string {
    const icons: Record<string, string> = {
      'CAFE': '☕',
      'RESTAURANT': '🍽️',
      'PARK': '🌳',
      'MUSEUM': '🏛️',
      'SHOPPING': '🛍️',
      'ENTERTAINMENT': '🎭',
      'NIGHTLIFE': '🌙',
      'SPORTS': '⚽',
      'OTHER': '📍'
    };
    return icons[type] || '📍';
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  }
}