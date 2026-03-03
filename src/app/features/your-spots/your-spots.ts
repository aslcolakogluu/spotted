import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SpotService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { Spot, SpotType } from '@core/models';

type TabType = 'added' | 'favorites';

@Component({
  selector: 'app-your-spots',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './your-spots.html',
  styleUrl: './your-spots.css',
})
export class YourSpotsComponent implements OnInit {
  private spotService = inject(SpotService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<TabType>('added');

  private allSpots = signal<Spot[]>([]);
  private favoriteIds = signal<Set<string>>(new Set());

  // Computed: Kullanıcının eklediği spotlar
  addedSpots = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    return this.allSpots()
      .filter((spot) => spot.userId === currentUser.email)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  // Computed: Favori spotlar
  favoriteSpots = computed(() => {
    const favIds = this.favoriteIds();
    return this.allSpots()
      .filter((spot) => favIds.has(spot.id))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  // Computed: Aktif tab'a göre spotlar
  displayedSpots = computed(() => {
    return this.activeTab() === 'added'
      ? this.addedSpots()
      : this.favoriteSpots();
  });

  ngOnInit(): void {
    // Auth kontrolü
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Spotları yükle
    this.spotService.getSpots().subscribe((spots) => {
      this.allSpots.set(spots);
    });

    // Favorileri yükle (LocalStorage'dan)
    this.loadFavorites();
  }

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  private loadFavorites(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const key = `favorites_${currentUser.email}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      const favArray: string[] = JSON.parse(stored);
      this.favoriteIds.set(new Set(favArray));
    }
  }

  toggleFavorite(spotId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const favIds = new Set(this.favoriteIds());

    if (favIds.has(spotId)) {
      favIds.delete(spotId);
    } else {
      favIds.add(spotId);
    }

    this.favoriteIds.set(favIds);

    // LocalStorage'a kaydet
    const key = `favorites_${currentUser.email}`;
    localStorage.setItem(key, JSON.stringify([...favIds]));
  }

  isFavorite(spotId: string): boolean {
    return this.favoriteIds().has(spotId);
  }

  deleteSpot(spotId: string): void {
    if (!confirm('Do you want to delete this spot?')) {
      return;
    }

    this.spotService.deleteSpot(spotId).subscribe({
      next: (success) => {
        if (success) {
          // Spot listesini güncelle
          this.allSpots.update((spots) => spots.filter((s) => s.id !== spotId));
          alert('Spot deleted successfully.');
        }
      },
      error: (error) => {
        console.error('Spot deletion failed:', error);
        alert('An error occurred while deleting the spot.');
      },
    });
  }

  getSpotTypeEmoji(type: SpotType): string {
    const types = {
      [SpotType.NATURE]: '',
      [SpotType.PARK]: '',
      [SpotType.BRIDGE]: '',
      [SpotType.HISTORICAL]: '',
      [SpotType.MUSEUM]: '',
      [SpotType.BEACH]: '',
      [SpotType.SPORTS]: '',
      [SpotType.OTHER]: '',
    };
    return types[type] || '';
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating));
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }
}
