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
  tags: string[];
  openingHours?: string;
  priceRange?: string;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
}

export enum SpotType {
  BRIDGE = 'bridge',
  NATURE = 'nature',
  HISTORICAL = 'historical',
  PARK = 'park',
  MUSEUM = 'museum',
  BEACH = 'beach',
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