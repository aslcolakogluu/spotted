import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
    

    
})
export class HeroComponent {
  stats = signal([
    { value: '47', label: 'Discovered Spots' },
    { value: '128', label: 'Reviews' },
    { value: '23', label: 'Active Explorers' },
    { value: '4.6', label: 'Average Quietness' }
  ]);

  onExploreClick(): void {
    console.log('Explore clicked');
  }

  onMapClick(): void {
    console.log('Map view clicked');
  }
}