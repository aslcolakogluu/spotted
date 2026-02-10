import { Injectable, signal, computed } from '@angular/core';
import { FilterOptions, FilterChip, FilterChipType, SpotType, PriceRange, SortOption } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private currentFilters = signal<FilterOptions>({
    types: [],
    sortBy: SortOption.RELEVANCE
  });

  readonly currentFilters$ = this.currentFilters.asReadonly();
  readonly activeFiltersCount = computed(() => this.getActiveFiltersCount());
  readonly filterChips = computed(() => this.getFilterChips());

  private readonly spotTypeLabels: Record<SpotType, string> = {
    [SpotType.BRIDGE]: 'Bridge',
    [SpotType.NATURE]: 'Nature',
    [SpotType.HISTORICAL]: 'Historical',
    [SpotType.PARK]: 'Park',
    [SpotType.MUSEUM]: 'Museum',
    [SpotType.BEACH]: 'Beach',
    [SpotType.SPORTS]: 'Sports',
    [SpotType.OTHER]: 'Other'
  };

  private readonly priceRangeLabels: Record<PriceRange, string> = {
    [PriceRange.BUDGET]: 'Budget',
    [PriceRange.MODERATE]: 'Moderate',
    [PriceRange.EXPENSIVE]: 'Expensive',
    [PriceRange.LUXURY]: 'Luxury'
  };

  constructor() {}

  setFilters(filters: Partial<FilterOptions>): void {
    this.currentFilters.update(current => ({
      ...current,
      ...filters
    }));
  }

  toggleType(type: SpotType): void {
    this.currentFilters.update(current => {
      const types = current.types.includes(type)
        ? current.types.filter(t => t !== type)
        : [...current.types, type];

      return { ...current, types };
    });
  }

  setPriceRange(range: PriceRange | undefined): void {
    this.currentFilters.update(current => ({
      ...current,
      priceRange: range
    }));
  }

  setMinRating(rating: number | undefined): void {
    this.currentFilters.update(current => ({
      ...current,
      rating
    }));
  }

  setMaxDistance(distance: number | undefined): void {
    this.currentFilters.update(current => ({
      ...current,
      distance
    }));
  }

  toggleTag(tag: string): void {
    this.currentFilters.update(current => {
      const tags = current.tags ?? [];
      const updatedTags = tags.includes(tag)
        ? tags.filter(t => t !== tag)
        : [...tags, tag];

      return { ...current, tags: updatedTags.length > 0 ? updatedTags : undefined };
    });
  }

  setSortBy(sortBy: SortOption): void {
    this.currentFilters.update(current => ({
      ...current,
      sortBy
    }));
  }

  toggleVerifiedOnly(): void {
    this.currentFilters.update(current => ({
      ...current,
      isVerified: !current.isVerified ? true : undefined
    }));
  }

  toggleOpenNow(): void {
    this.currentFilters.update(current => ({
      ...current,
      isOpen: !current.isOpen ? true : undefined
    }));
  }

  clearFilters(): void {
    this.currentFilters.set({
      types: [],
      sortBy: SortOption.RELEVANCE
    });
  }

  removeChip(chip: FilterChip): void {
    switch (chip.type) {
      case FilterChipType.TYPE:
        this.toggleType(chip.value as SpotType);
        break;
      case FilterChipType.PRICE:
        this.setPriceRange(undefined);
        break;
      case FilterChipType.RATING:
        this.setMinRating(undefined);
        break;
      case FilterChipType.TAG:
        this.toggleTag(chip.value as string);
        break;
      case FilterChipType.FEATURE:
        if (chip.id === 'verified') {
          this.toggleVerifiedOnly();
        } else if (chip.id === 'open') {
          this.toggleOpenNow();
        }
        break;
    }
  }

  private getActiveFiltersCount(): number {
    const filters = this.currentFilters();
    let count = 0;

    count += filters.types.length;
    if (filters.priceRange) count++;
    if (filters.rating) count++;
    if (filters.distance) count++;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.isVerified) count++;
    if (filters.isOpen) count++;

    return count;
  }

  private getFilterChips(): FilterChip[] {
    const filters = this.currentFilters();
    const chips: FilterChip[] = [];

    // Type chips
    filters.types.forEach(type => {
      chips.push({
        id: `type-${type}`,
        label: this.spotTypeLabels[type],
        value: type,
        type: FilterChipType.TYPE,
        isActive: true
      });
    });

    // Price range chip
    if (filters.priceRange) {
      chips.push({
        id: 'price',
        label: this.priceRangeLabels[filters.priceRange],
        value: filters.priceRange,
        type: FilterChipType.PRICE,
        isActive: true
      });
    }

    // Rating chip
    if (filters.rating) {
      chips.push({
        id: 'rating',
        label: `${filters.rating}+ Stars`,
        value: filters.rating,
        type: FilterChipType.RATING,
        isActive: true
      });
    }

    // Tag chips
    filters.tags?.forEach(tag => {
      chips.push({
        id: `tag-${tag}`,
        label: tag,
        value: tag,
        type: FilterChipType.TAG,
        isActive: true
      });
    });

    // Feature chips
    if (filters.isVerified) {
      chips.push({
        id: 'verified',
        label: 'Verified',
        value: true,
        type: FilterChipType.FEATURE,
        isActive: true
      });
    }

    if (filters.isOpen) {
      chips.push({
        id: 'open',
        label: 'Open Now',
        value: true,
        type: FilterChipType.FEATURE,
        isActive: true
      });
    }

    return chips;
  }
}