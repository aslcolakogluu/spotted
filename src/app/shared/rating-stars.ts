import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center gap-1">
      <div class="flex">
        @for (star of stars; track $index) {
          <svg 
            [class]="getStarClass($index)"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        }
      </div>
      @if (showRating) {
        <span class="text-sm font-medium text-gray-700 ml-1">
          {{ rating.toFixed(1) }}
        </span>
      }
      @if (showCount && count) {
        <span class="text-sm text-gray-500 ml-1">
          ({{ count }})
        </span>
      }
    </div>
  `,
  styles: []
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() count?: number;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showRating: boolean = false;
  @Input() showCount: boolean = false;

  get stars(): number[] {
    return Array(5).fill(0); // 5 yıldız göstermek için sabit bir dizi döndürülür, böylece her bir yıldız için @for döngüsü ile SVG ikonları oluşturulabilir
  }

  getStarClass(index: number): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const fillClass = index < Math.floor(this.rating)  // Eğer index, rating'in tam kısmından küçükse, tam dolu yıldız olarak işaretlenir, böylece kullanıcılar rating'in tam kısmını görsel olarak ayırt edebilirler
      ? 'text-yellow-400' 
      : index < this.rating 
        ? 'text-yellow-300' 
        : 'text-gray-300';

    return `${sizeClasses[this.size]} ${fillClass}`;
  }
}