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
  featuredSpots = signal<Spot[]>([]);
  selectedFilter = signal<string>('All Spots');
  
  filters = ['All Spots', 'Scenic View', 'Park', 'Bridge', 'Isolated Road', 'Balcony', 'Historical'];

  constructor(private spotService: SpotService) {}

  ngOnInit(): void {
    this.spotService.getFeaturedSpots().subscribe((spots: Spot[]) => {
      this.featuredSpots.set(spots);
    });
  }

  onSpotClick(spot: Spot): void {
    console.log('Spot clicked:', spot);
  }

  onFilterClick(filter: string): void {
    this.selectedFilter.set(filter);
    console.log('Filter clicked:', filter);
  }

  getSpotIcon(type: string): string {
    const icons: Record<string, string> = {
      'BRIDGE': '🌉',
      'PARK': '🌳',
      'MUSEUM': '🏛️',
      'HISTORICAL': '🏰',
      'BEACH': '🏖️',
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