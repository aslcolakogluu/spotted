export interface Spot {
  id: string;
  name: string;
  type: SpotType;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  openingHours?: string;
  priceRange?: string;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageURL?: string;
}

export enum SpotType {
  CAFE = 'cafe',
  RESTAURANT = 'restaurant',
  PARK = 'park',
  MUSEUM = 'museum',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  NIGHTLIFE = 'nightlife',
  SPORTS = 'sports',
  OTHER = 'other'
}

export interface SpotCreateDto {
  name: string;
  type: SpotType;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  tags?: string[];
  openingHours?: string;
  priceRange?: string;
}

export interface SpotUpdateDto extends Partial<SpotCreateDto> {
  id: string;
}