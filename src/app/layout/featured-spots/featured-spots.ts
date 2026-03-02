// Öne çıkan mekanlar (featured spots) bileşeni — ana sayfada isFeatured=true olan mekanları listeler
// Filtre sekmeleriyle kategori bazlı görüntüleme sağlar
import { Component, OnInit, signal, effect } from '@angular/core';
import { SpotService } from '@core/services';
import { Spot } from '@core/models';

@Component({
  selector: 'app-featured-spot',
  standalone: true,
  imports: [],
  templateUrl: './featured-spots.html',
  styleUrl: './featured-spots.css',
})
export class FeaturedSpotComponent implements OnInit {
  featuredSpots = signal<Spot[]>([]);        // SpotService'ten gelen öne çıkan mekanlar
  selectedFilter = signal<string>('All Spots'); // Aktif filtre sekmesi

  // Filtre sekme seçenekleri — kullanıcı bunlar arasında geçiş yapabilir
  filters = [
    'All Spots',
    'Scenic View',
    'Park',
    'Bridge',
    'Isolated Road',
    'Balcony',
    'Historical',
  ];

  constructor(private spotService: SpotService) { } // SpotService: öne çıkan mekanları çekmek için

  // Bileşen başlatıldığında isFeatured=true olan mekanlar servisten çekilir
  ngOnInit(): void {
    this.spotService.getFeaturedSpots().subscribe((spots: Spot[]) => {
      this.featuredSpots.set(spots);
    });
  }

  // Mekan kartına tıklandığında çalışır (şu an sadece log — detay sayfası eklenebilir)
  onSpotClick(spot: Spot): void {
    console.log('Spot clicked:', spot);
  }

  // Filtre sekmesine tıklandığında aktif filtreyi günceller
  onFilterClick(filter: string): void {
    this.selectedFilter.set(filter);
    console.log('Filter clicked:', filter);
  }

  // Emoji'ler SVG ikonlara dönüştürüldü, bu method artık kullanılmıyor
  getSpotIcon(type: string): string {
    return '';
  }

  // Mekan puanını dolu/boş yıldızlara dönüştürür (5 yıldız sistemi)
  // Örnek: 4.2 puan → "████☆" (4 dolu, 1 boş yıldız)
  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  }
}
