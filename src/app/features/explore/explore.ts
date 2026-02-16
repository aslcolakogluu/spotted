import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpotService } from '@core/services';
import { Spot, SpotType, SortOption } from '@core/models';

const GRADS = [
  'linear-gradient(145deg, #1e3a3a 0%, #2a4a3a 40%, #1a2a2a 100%)',
  'linear-gradient(155deg, #2a2035 0%, #3a2a45 45%, #1a1525 100%)',
  'linear-gradient(140deg, #253545 0%, #1e2d3d 50%, #152535 100%)',
  'linear-gradient(160deg, #352520 0%, #453525 45%, #251a15 100%)',
  'linear-gradient(135deg, #2a3525 0%, #354530 50%, #1a2515 100%)',
  'linear-gradient(150deg, #253040 0%, #2a3848 50%, #152030 100%)'
];

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class ExploreComponent implements OnInit {
  private spotService = inject(SpotService);
  private router = inject(Router);

  searchQuery = '';
  sortBy = signal<SortOption>(SortOption.RATING);
  
  selectedCategory = signal<SpotType | null>(null);
  filter5Star = true;
  filter4Star = true;
  filter3Star = false;
  
  currentPage = signal(1);
  itemsPerPage = 9;

  private allSpots = signal<Spot[]>([]);

  readonly spotTypes = [
    { type: SpotType.NATURE, label: 'Nature'},
    { type: SpotType.PARK, label: 'Park' },
    { type: SpotType.BRIDGE, label: 'Bridge'},
    { type: SpotType.HISTORICAL, label: 'Historical' },
    { type: SpotType.MUSEUM, label: 'Museum'},
    { type: SpotType.BEACH, label: 'Beach'},
    { type: SpotType.SPORTS, label: 'Sports' },
    { type: SpotType.OTHER, label: 'Other', emoji: '📍' }
  ];

  filteredSpots = computed(() => {
    let spots = this.allSpots();

    const cat = this.selectedCategory();
    if (cat) spots = spots.filter(s => s.type === cat);

    const ratings: number[] = [];
    if (this.filter5Star) ratings.push(5);
    if (this.filter4Star) ratings.push(4);
    if (this.filter3Star) ratings.push(3);
    
    if (ratings.length > 0) {
      spots = spots.filter(s => {
        const r = Math.round(s.rating);
        return ratings.includes(r) || 
               (this.filter4Star && r >= 4) || 
               (this.filter3Star && r >= 3);
      });
    }

    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      spots = spots.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      );
    }

    return this.sortSpots(spots);
  });

  topRankings = computed(() => {
    return [...this.allSpots()]
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, 5);
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredSpots().length / this.itemsPerPage)
  );

  paginatedSpots = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredSpots().slice(start, start + this.itemsPerPage);
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
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
  });

  ngOnInit(): void {
    this.spotService.getSpots().subscribe(spots => {
      this.allSpots.set(spots);
    });
  }

  setCategory(type: SpotType | null): void {
    this.selectedCategory.set(type);
    this.currentPage.set(1);
  }

  onSearchChange(): void {
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
        return [...spots].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getGradient(index: number): string {
    return GRADS[index % GRADS.length];
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating));
  }

  // ✅ YENİ: Spot type'a göre emoji
  getSpotTypeEmoji(type: SpotType): string {
    const found = this.spotTypes.find(t => t.type === type);
    return found?.emoji || '📍';
  }

  // ✅ YENİ: Spot type'a göre label
  getSpotTypeLabel(type: SpotType): string {
    const found = this.spotTypes.find(t => t.type === type);
    return found?.label || 'Diğer';
  }
}