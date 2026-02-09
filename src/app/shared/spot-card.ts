import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Spot } from '@core/models';
import { RatingStarsComponent } from '@shared/rating-stars';
import { SpotTypeIconPipe, SpotTypeLabelPipe } from '@core/pipes';

@Component({
  selector: 'app-spot-card',
  standalone: true,
  imports: [
    RatingStarsComponent,
    SpotTypeIconPipe,
    SpotTypeLabelPipe
  ],
  template: `
    <div 
      class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      (click)="handleClick()">
      <!-- Image -->
      <div class="relative h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1770299258205-3d67df947527?w=1920&q=80&auto=format&fit=crop"
          alt="Featured spot"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
        
        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-2">
          @if (spot.isVerified) {
            <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Verified
            </span>
          }
          
          @if (spot.isFeatured) {
            <span class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              Featured
            </span>
          }
        </div>

        <!-- Type Badge -->
        <div class="absolute top-3 right-3">
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full">
            <span [innerHTML]="spot.type | spotTypeIcon"></span>
            {{ spot.type | spotTypeLabel }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {{ spot.name }}
        </h3>
        
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">
          {{ spot.description }}
        </p>

        <!-- Location -->
        <div class="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="line-clamp-1">{{ spot.address }}</span>
        </div>

        <!-- Rating and Reviews -->
        <div class="flex items-center justify-between mb-3">
          <app-rating-stars 
            [rating]="spot.rating" 
            [count]="spot.reviewCount"
            size="sm"
            [showRating]="true"
            [showCount]="true">
          </app-rating-stars>
        </div>

        <!-- Tags -->
        @if (spot.tags && spot.tags.length > 0) {
          <div class="flex flex-wrap gap-1.5">
            @for (tag of spot.tags.slice(0, 3); track tag) {
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {{ tag }}
              </span>
            }
            @if (spot.tags.length > 3) {
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{{ spot.tags.length - 3 }}
              </span>
            }
          </div>
        }

        <!-- Price Range -->
        @if (spot.priceRange) {
          <div class="mt-3 pt-3 border-t border-gray-100">
            <span class="text-sm font-medium text-gray-700">{{ spot.priceRange }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class SpotCardComponent {
  @Input() spot!: Spot;
  @Output() spotClick = new EventEmitter<Spot>();

  handleClick(): void {
    this.spotClick.emit(this.spot);
  }
}