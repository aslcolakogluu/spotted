import { SpotType } from './spot.model';

export interface FilterOptions {
  types: SpotType[];
  priceRange?: PriceRange;
  rating?: number;
  distance?: number;
  tags?: string[];
  isVerified?: boolean;
  isOpen?: boolean;
  sortBy?: SortOption;
}

export enum PriceRange {
  BUDGET = 'budget',
  MODERATE = 'moderate',
  EXPENSIVE = 'expensive',
  LUXURY = 'luxury'
}

export enum SortOption {
  RELEVANCE = 'relevance',
  RATING = 'rating',
  DISTANCE = 'distance',
  NEWEST = 'newest',
  MOST_REVIEWED = 'most_reviewed'
}

export interface FilterChip {
  id: string;
  label: string;
  value: any;
  type: FilterChipType;
  isActive: boolean;
}

export enum FilterChipType {
  TYPE = 'type',
  PRICE = 'price',
  RATING = 'rating',
  TAG = 'tag',
  FEATURE = 'feature'
}