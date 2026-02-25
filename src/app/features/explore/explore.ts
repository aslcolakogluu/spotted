import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotService } from '@core/services';
import { Spot, SpotType, SortOption } from '@core/models';

const GRADS = [
  'linear-gradient(145deg, #1e3a3a 0%, #2a4a3a 40%, #1a2a2a 100%)',
  'linear-gradient(155deg, #2a2035 0%, #3a2a45 45%, #1a1525 100%)',
  'linear-gradient(140deg, #253545 0%, #1e2d3d 50%, #152535 100%)',
  'linear-gradient(160deg, #352520 0%, #453525 45%, #251a15 100%)',
  'linear-gradient(135deg, #2a3525 0%, #354530 50%, #1a2515 100%)',
  'linear-gradient(150deg, #253040 0%, #2a3848 50%, #152030 100%)',
];

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class ExploreComponent implements OnInit {
  private spotService = inject(SpotService);

  searchQuery = '';
  activeSearchQuery = signal(''); // ✅ Enter için aktif query
  sortBy = signal<SortOption>(SortOption.RATING);

  selectedCategory = signal<SpotType | null>(null);
  filter5Star = true;
  filter4Star = true;
  filter3Star = false;

  currentPage = signal(1);
  itemsPerPage = 9;

  private allSpots = signal<Spot[]>([]);

  readonly spotTypes = [
    { type: SpotType.NATURE, label: 'Nature', emoji: '' },
    { type: SpotType.PARK, label: 'Park', emoji: '' },
    { type: SpotType.BRIDGE, label: 'Bridge', emoji: '' },
    { type: SpotType.HISTORICAL, label: 'Historical', emoji: '' },
    { type: SpotType.MUSEUM, label: 'Museum', emoji: '' },
    { type: SpotType.BEACH, label: 'Beach', emoji: '' },
    { type: SpotType.SPORTS, label: 'Sports', emoji: '' },
    { type: SpotType.OTHER, label: 'Other', emoji: '' },
  ];

  // ✅ Filtered spots getter
  get filteredSpots(): Spot[] {
    let spots = this.allSpots();

    // Category filter
    const cat = this.selectedCategory();
    if (cat) spots = spots.filter((s) => s.type === cat);

    // Rating filter
    const ratings: number[] = [];
    if (this.filter5Star) ratings.push(5);
    if (this.filter4Star) ratings.push(4);
    if (this.filter3Star) ratings.push(3);

    if (ratings.length > 0) {
      spots = spots.filter((s) => {
        const r = Math.round(s.rating);
        // 5★ seçili: sadece 5
        // 4★ seçili: 4 ve üzeri
        // 3★ seçili: 3 ve üzeri
        if (this.filter5Star && r === 5) return true;
        if (this.filter4Star && r >= 4) return true;
        if (this.filter3Star && r >= 3) return true;
        return false;
      });
    }

    // Search filter - ✅ activeSearchQuery kullan
    const query = this.activeSearchQuery().trim().toLowerCase();
    if (query) {
      spots = spots.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query) ||
          (s.description && s.description.toLowerCase().includes(query)),
      );
    }

    return this.sortSpots(spots);
  }

  get topRankings(): Spot[] {
    return [...this.allSpots()]
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, 5);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSpots.length / this.itemsPerPage);
  }

  get paginatedSpots(): Spot[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredSpots.slice(start, start + this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 2) pages.push(-1);
      pages.push(total);
    }

    return pages;
  }

  ngOnInit(): void {
    this.spotService.getSpots().subscribe((spots) => {
      console.log('Explore: Spots loaded', spots.length);
      this.allSpots.set(spots);
    });
  }

  setCategory(type: SpotType | null): void {
    this.selectedCategory.set(type);
    this.currentPage.set(1);
  }

  // ✅ Enter'a basınca çağrılır
  onSearchSubmit(): void {
    console.log('Search submitted:', this.searchQuery);
    this.activeSearchQuery.set(this.searchQuery);
    this.currentPage.set(1);
  }

  onSortChange(): void {
    this.currentPage.set(1);
  }

  applyFilters(): void {
    this.currentPage.set(1);
  }

  sortSpots(spots: Spot[]): Spot[] {
    const sortOption = this.sortBy();

    switch (sortOption) {
      case SortOption.RATING:
        return [...spots].sort((a, b) => b.rating - a.rating);
      case SortOption.MOST_REVIEWED:
        return [...spots].sort((a, b) => b.reviewCount - a.reviewCount);
      case SortOption.NEWEST:
        return [...spots].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
      default:
        return spots;
    }
  }

  goToPage(page: number): void {
    if (page === -1) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getGradient(index: number): string {
    return GRADS[index % GRADS.length];
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating));
  }

  getSpotTypeEmoji(type: SpotType): string {
    const found = this.spotTypes.find((t) => t.type === type);
    return found?.emoji || '';
  }

  getSpotTypeLabel(type: SpotType): string {
    const found = this.spotTypes.find((t) => t.type === type);
    return found?.label || 'Other';
  }
}
