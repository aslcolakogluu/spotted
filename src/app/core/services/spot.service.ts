import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Spot, SpotType, SpotCreateDto, SpotUpdateDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SpotService {
  private spots = signal<Spot[]>(this.generateMockSpots());
  readonly spots$ = this.spots.asReadonly();

  constructor() {}

  getSpots(): Observable<Spot[]> {
    return of(this.spots()).pipe(delay(300));
  }

  getSpotById(id: string): Observable<Spot | undefined> {
    const spot = this.spots().find(s => s.id === id);
    return of(spot).pipe(delay(200));
  }

  getFeaturedSpots(): Observable<Spot[]> {
    const featured = this.spots().filter(s => s.isFeatured);
    return of(featured).pipe(delay(300));
  }

  getSpotsByType(type: SpotType): Observable<Spot[]> {
    const filtered = this.spots().filter(s => s.type === type);
    return of(filtered).pipe(delay(300));
  }

  createSpot(dto: SpotCreateDto): Observable<Spot> {
    const newSpot: Spot = {
      id: this.generateId(),
      ...dto,
      rating: 0,
      reviewCount: 0,
      imageUrl: dto.imageUrl ?? '/assets/placeholder.jpg',
      tags: dto.tags ?? [],
      isVerified: false,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.spots.update(spots => [...spots, newSpot]);
    return of(newSpot).pipe(delay(500));
  }

  updateSpot(dto: SpotUpdateDto): Observable<Spot | null> {
    const index = this.spots().findIndex(s => s.id === dto.id);
    
    if (index === -1) {
      return of(null).pipe(delay(200));
    }

    this.spots.update(spots => {
      const updated = [...spots];
      updated[index] = {
        ...updated[index],
        ...dto,
        updatedAt: new Date()
      };
      return updated;
    });

    return of(this.spots()[index]).pipe(delay(500));
  }

  deleteSpot(id: string): Observable<boolean> {
    const exists = this.spots().some(s => s.id === id);
    
    if (exists) {
      this.spots.update(spots => spots.filter(s => s.id !== id));
      return of(true).pipe(delay(300));
    }

    return of(false).pipe(delay(200));
  }

  searchSpots(query: string): Observable<Spot[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.spots().filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    return of(filtered).pipe(delay(400));
  }

  private generateId(): string {
    return `spot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMockSpots(): Spot[] {
    return [
      {
        id: '1',
        name: 'City Cafe',
        type: SpotType.CAFE,
        description: 'Inviting cafe with great coffee and cozy atmosphere',
        address: 'Kızılay, Ankara',
        latitude: 39.9208,
        longitude: 32.8541,
        rating: 4.5,
        reviewCount: 127,
        imageUrl: 'https://images.unsplash.com/photo-1770299258205-3d67df947527?w=1920&q=80&auto=format&fit=crop',
        tags: ['wifi', 'working', 'quiet'],
        openingHours: '8 PM - 10 PM',
        priceRange: '₺₺',
        isVerified: true,
        isFeatured: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-01')
      },
      {
        id: '2',
        name: 'Pizza Restaurant',
        type: SpotType.RESTAURANT,
        description: 'Delicious pizzas with breathtaking views',
        address: 'Çankaya, Ankara',
        latitude: 39.9185,
        longitude: 32.8543,
        rating: 4.8,
        reviewCount: 234,
        imageUrl: 'https://images.unsplash.com/photo-1763992108632-77121f308b43?q=80&w=1317&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['breathtaking', 'romantic', 'premium'],
        openingHours: '11:00 AM - 11:00 PM',
        priceRange: '₺₺₺',
        isVerified: true,
        isFeatured: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-28')
      },
      {
        id: '3',
        name: 'City Park',
        type: SpotType.PARK,
        description: 'Spacious park with walking trails, playgrounds, and picnic areas',
        address: 'Ulus, Ankara',
        latitude: 39.9334,
        longitude: 32.8597,
        rating: 4.3,
        reviewCount: 89,
        imageUrl: 'https://images.unsplash.com/photo-1591473499350-183602ebb445?q=80&w=1286&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['family', 'nature', 'walking'],
        openingHours: '6 AM - 10 PM',
        priceRange: 'Free',
        isVerified: true,
        isFeatured: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-02')
      },
      {
        id: '4',
        name: 'Art Gallery',
        type: SpotType.MUSEUM,
        description: 'Modern art pieces displayed in a beautiful gallery',
        address: 'Kavaklıdere, Ankara',
        latitude: 39.9120,
        longitude: 32.8620,
        rating: 4.6,
        reviewCount: 156,
        imageUrl: 'https://images.unsplash.com/photo-1765153885305-85e56c2efe92?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['art', 'culture', 'exhibition'],
        openingHours: '10:00 AM - 7:00 PM',
        priceRange: '₺',
        isVerified: true,
        isFeatured: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-30')
      },
      {
        id: '5',
        name: 'AVM Center',
        type: SpotType.SHOPPING,
        description: 'Large shopping mall with a variety of stores and entertainment options',
        address: 'Bilkent, Ankara',
        latitude: 39.8686,
        longitude: 32.7487,
        rating: 4.4,
        reviewCount: 312,
        imageUrl: 'https://images.unsplash.com/photo-1589200495655-5e0995786149?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['shopping', 'cinema', 'food'],
        openingHours: '10:00 AM - 10:00 PM',
        priceRange: '₺₺',
        isVerified: true,
        isFeatured: false,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-02-03')
      }
    ];
  }
}