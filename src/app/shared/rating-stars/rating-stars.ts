import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [],
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.css',
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