import { Component, signal, inject } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
    

    
})
export class HeroComponent {
  private router = inject(Router);
  stats = signal([
    { value: '47', label: 'Discovered Spots' },
    { value: '128', label: 'Reviews' },
    { value: '23', label: 'Active Explorers' },
    { value: '4.6', label: 'Average Quietness' }
  ]);

  onExploreClick(): void {
    this.router.navigate(['/explore']);
  }

  onMapClick(): void {
    this.router.navigate(['/map']);
  }
}