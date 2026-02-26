import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { Spot, SpotType, SpotCreateDto, SpotUpdateDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SpotService {
  private spots = signal<Spot[]>(this.generateMockSpots());
  readonly spots$ = this.spots.asReadonly();

  // Reactive stream — her spot eklenince/silinince tüm subscriber'lar güncellenir
  private spotsSubject = new BehaviorSubject<Spot[]>(this.spots());

  constructor() {}

  getSpots(): Observable<Spot[]> {
    return this.spotsSubject.asObservable();
  }

  getSpotById(id: string): Observable<Spot | undefined> {
    const spot = this.spots().find((s) => s.id === id); // id'ye göre spot bulur, eğer yoksa undefined döner
    return of(spot).pipe(delay(200));
  }

  getFeaturedSpots(): Observable<Spot[]> {
    const featured = this.spots().filter((s) => s.isFeatured); // isFeatured özelliği true olan spotları filtreler
    return of(featured).pipe(delay(300));
  }

  getSpotsByType(type: SpotType): Observable<Spot[]> {
    const filtered = this.spots().filter((s) => s.type === type); // parametre olarak verilen type ile eşleşen spotları filtreler
    return of(filtered).pipe(delay(300));
  }

  createSpot(dto: SpotCreateDto): Observable<Spot> {
    const newSpot: Spot = {
      id: this.generateId(),
      ...dto, // dto'dan gelen alanları spread operatörü ile yeni spot objesine ekler diğerleri manuel veriliyor
      rating: 0,
      reviewCount: 0,
      imageUrl: dto.imageUrl ?? '/assets/placeholder.jpg',
      tags: dto.tags ?? [],
      isVerified: false,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.spots.update((spots) => [...spots, newSpot]);
    this.spotsSubject.next(this.spots()); // tüm subscriber'lara bildir
    return of(newSpot).pipe(delay(500));
  }

  updateSpot(dto: SpotUpdateDto): Observable<Spot | null> {
    const index = this.spots().findIndex((s) => s.id === dto.id); // güncellenmek istenen spotun index'ini bulur, eğer yoksa -1 döner

    if (index === -1) {
      return of(null).pipe(delay(200));
    }

    this.spots.update((spots) => {
      const updated = [...spots];
      updated[index] = {
        // mevcut spotun üzerine dto'dan gelen alanları ekler, updatedAt alanını günceller
        ...updated[index],
        ...dto,
        updatedAt: new Date(),
      };
      return updated;
    });

    return of(this.spots()[index]).pipe(delay(500));
  }

  deleteSpot(id: string): Observable<boolean> {
    const exists = this.spots().some((s) => s.id === id);

    if (exists) {
      this.spots.update((spots) => spots.filter((s) => s.id !== id));
      this.spotsSubject.next(this.spots());
      return of(true).pipe(delay(300));
    }

    return of(false).pipe(delay(200));
  }

  searchSpots(query: string): Observable<Spot[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.spots().filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
    return of(filtered).pipe(delay(400));
  }

  private generateId(): string {
    return `spot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; //gerçek backend olmadığı için basit bir id üretme yöntemi kullanıyorum, timestamp ve random string kombinasyonu ile benzersiz id oluşturur
  }

  private generateMockSpots(): Spot[] {
    return [
      {
        id: '1',
        name: 'City Bridge',
        type: SpotType.BRIDGE,
        description: 'Beautiful bridge with scenic views over the river',
        address: 'Kızılay, Ankara',
        latitude: 39.9208,
        longitude: 32.8541,
        rating: 4.5,
        reviewCount: 127,
        imageUrl:
          'https://images.unsplash.com/photo-1577999315287-51e3261f60db?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['scenic', 'view', 'quiet'],
        openingHours: 'Every day 24 hours',
        priceRange: '₺₺',
        isVerified: true,
        isFeatured: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: '2',
        name: 'Tree Park',
        type: SpotType.NATURE,
        description: 'Nature with breathtaking views',
        address: 'Çankaya, Ankara',
        latitude: 39.9185,
        longitude: 32.8543,
        rating: 4.8,
        reviewCount: 234,
        imageUrl:
          'https://images.unsplash.com/photo-1506972804356-0061d8b8e26e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['breathtaking', 'romantic', 'nature'],
        openingHours: '9:00 AM - 11:00 PM',
        priceRange: '₺₺₺',
        isVerified: true,
        isFeatured: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-28'),
      },
      {
        id: '3',
        name: 'Historical Square',
        type: SpotType.HISTORICAL,
        description:
          'Historical buildings in the middle of the city with a relaxing atmosphere',
        address: 'Ulus, Ankara',
        latitude: 39.9334,
        longitude: 32.8597,
        rating: 4.3,
        reviewCount: 89,
        imageUrl:
          'https://images.unsplash.com/photo-1640397367330-35130a6ef891?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['family', 'historical', 'relaxing'],
        openingHours: '6 AM - 10 PM',
        priceRange: 'Free',
        isVerified: true,
        isFeatured: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-02'),
      },
      {
        id: '4',
        name: 'Art Gallery',
        type: SpotType.MUSEUM,
        description: 'Modern art pieces displayed in a beautiful gallery',
        address: 'Kavaklıdere, Ankara',
        latitude: 39.912,
        longitude: 32.862,
        rating: 4.6,
        reviewCount: 156,
        imageUrl:
          'https://images.unsplash.com/photo-1765153885305-85e56c2efe92?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['art', 'culture', 'exhibition'],
        openingHours: '10:00 AM - 7:00 PM',
        priceRange: '₺',
        isVerified: true,
        isFeatured: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-30'),
      },
      {
        id: '5',
        name: 'Park with green trees',
        type: SpotType.PARK,
        description: 'Large park with green trees and peaceful atmosphere',
        address: 'Bilkent, Ankara',
        latitude: 39.8686,
        longitude: 32.7487,
        rating: 4.4,
        reviewCount: 312,
        imageUrl:
          'https://images.unsplash.com/photo-1724588116521-6e7098a5d6ec?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['green', 'trees', 'peaceful'],
        openingHours: '10:00 AM - 10:00 PM',
        priceRange: '₺₺',
        isVerified: true,
        isFeatured: false,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-02-03'),
      },
      {
        id: '6',
        name: 'Beach with golden sand',
        type: SpotType.BEACH,
        description:
          'Golden sand beach with clear water and relaxing atmosphere',
        address: 'Antalya, Turkey',
        latitude: 36.8917,
        longitude: 30.7825,
        rating: 4.7,
        reviewCount: 312,
        imageUrl:
          'https://images.unsplash.com/photo-1705304367361-3f64429b3c91?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['modern', 'golden', 'relaxing'],
        openingHours: 'Every day 24 hours',
        priceRange: '₺₺',
        isVerified: true,
        isFeatured: false,
        createdAt: new Date('2025-01-12'),
        updatedAt: new Date('2025-02-03'),
      },
      {
        id: '7',
        name: 'Sports with relaxing atmosphere',
        type: SpotType.SPORTS,
        description: 'Sports facility with a relaxing atmosphere',
        address: 'Ankara, Turkey',
        latitude: 39.955,
        longitude: 32.89,
        rating: 4.7,
        reviewCount: 312,
        imageUrl:
          'https://images.unsplash.com/photo-1751283855655-0fd0651ab45f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['sports', 'facility', 'relaxing'],
        openingHours: 'Every day 24 hours',
        priceRange: '₺₺',
        isVerified: true,
        isFeatured: false,
        createdAt: new Date('2025-03-12'),
        updatedAt: new Date('2025-07-03'),
      },
    ];
  }
}
