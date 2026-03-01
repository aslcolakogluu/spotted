import { Injectable, signal } from '@angular/core'; 
import { Observable, of, delay } from 'rxjs'; 
import { Activity, ActivityType, ActivityFilter } from '../models'; 

@Injectable({
  providedIn: 'root' 
})
export class ActivityService {  // aktivite yönetimi için servis
  private activities = signal<Activity[]>(this.generateMockActivities()); // başlangıçta mock aktivitelerle doldurulmuş sinyal
  readonly activities$ = this.activities.asReadonly(); // aktiviteleri dışarıya salt okunur olarak sunar

  constructor() {} // constructor boş çünkü şu anda herhangi bir bağımlılık yok

  getActivities(filter?: ActivityFilter): Observable<Activity[]> { // aktiviteleri filtreleyerek getiren metod
    let filtered = this.activities(); // mevcut aktiviteleri alır

    if (filter) {
      if (filter.type?.length) { // eğer tür filtresi varsa ve boş değilse
        filtered = filtered.filter(a => filter.type!.includes(a.type)); // filter by type array, includes ile türü kontrol eder
      } // filter by array of types

      if (filter.userId) { // eğer userId filtresi varsa
        filtered = filtered.filter(a => a.userId === filter.userId); //userId'ye göre filtreler, sadece belirtilen userId'ye sahip aktiviteleri döndürür
      } // filter by userId

      if (filter.spotId) { // eğer spotId filtresi varsa
        filtered = filtered.filter(a => a.spotId === filter.spotId); // spotId'ye göre filtreler, sadece belirtilen spotId'ye sahip aktiviteleri döndürür
      } // filter by spotId

      if (filter.startDate) { // eğer startDate filtresi varsa
        filtered = filtered.filter(a => new Date(a.timestamp) >= filter.startDate!); // timestamp'ı startDate ile karşılaştırır, sadece belirtilen startDate'den sonra veya eşit olan aktiviteleri döndürür
      } // filter by startDate

      if (filter.endDate) { // eğer endDate filtresi varsa
        filtered = filtered.filter(a => new Date(a.timestamp) <= filter.endDate!); // timestamp'ı endDate ile karşılaştırır, sadece belirtilen endDate'den önce veya eşit olan aktiviteleri döndürür
      } // filter by endDate

      if (filter.limit) { // eğer limit filtresi varsa
        filtered = filtered.slice(0, filter.limit); // slice ile belirtilen limit kadar aktivite döndürür, ancak bu filtre diğer tüm filtrelerden sonra uygulanır, böylece önce tüm filtreler uygulanır ve ardından sonuçlar limitlenir
      } // apply limit after all other filters
    }
 
    return of(filtered).pipe(delay(300)); // filtrelenmiş aktiviteleri Observable olarak döndürür, delay ile simüle edilmiş gecikme ekler, böylece gerçek bir API çağrısı gibi davranır
  }  

  getRecentActivities(limit: number = 10): Observable<Activity[]> {  // en yeni aktiviteleri getiren metod, varsayılan limit 10
    const recent = [...this.activities()]  // mevcut aktiviteleri kopyalar, böylece orijinal array'i değiştirmez
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // aktiviteleri timestamp'lerine göre büyükten küçüğe sıralar, böylece en yeni aktiviteler en üstte olur
      .slice(0, limit); // slice ile belirtilen limit kadar aktivite döndürür, böylece sadece en yeni aktiviteler alınır
    
    return of(recent).pipe(delay(200)); 
  }

  getUserActivities(userId: string, limit?: number): Observable<Activity[]> {    // belirli bir kullanıcıya ait aktiviteleri getiren metod, opsiyonel limit parametresi ile döndürülecek aktivite sayısını sınırlayabilir
    let userActivities = this.activities().filter(a => a.userId === userId);   // 
    
    if (limit) {
      userActivities = userActivities.slice(0, limit);  // slice ile belirtilen limit kadar aktivite döndürür, ancak bu filtre diğer tüm filtrelerden sonra uygulanır, böylece önce tüm filtreler uygulanır ve ardından sonuçlar limitlenir
    } 

    return of(userActivities).pipe(delay(300));
  }

  getSpotActivities(spotId: string, limit?: number): Observable<Activity[]> { // belirli bir mekana ait aktiviteleri getiren metod, opsiyonel limit parametresi ile döndürülecek aktivite sayısını sınırlayabilir
    let spotActivities = this.activities().filter(a => a.spotId === spotId); // mevcut aktiviteleri spotId'ye göre filtreler, sadece belirtilen spotId'ye sahip aktiviteleri döndürür
    
    if (limit) {
      spotActivities = spotActivities.slice(0, limit); // slice ile belirtilen limit kadar aktivite döndürür, ancak bu filtre diğer tüm filtrelerden sonra uygulanır, böylece önce tüm filtreler uygulanır ve ardından sonuçlar limitlenir
    }

    return of(spotActivities).pipe(delay(300));
  }

  addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Observable<Activity> { // yeni bir aktivite ekleyen metod, id ve timestamp otomatik olarak oluşturulur, bu nedenle parametre olarak alınmaz
    const newActivity: Activity = { 
      ...activity, // spread operator ile gelen aktivite verilerini alır
      id: this.generateId(), 
      timestamp: new Date()
    };

    this.activities.update(activities => [newActivity, ...activities]); // yeni aktiviteyi başa ekliyor
    return of(newActivity).pipe(delay(200));
  }

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; 
  } 

  private generateMockActivities(): Activity[] { // başlangıç state üretir
    const now = new Date(); 
    
    return [
      {
        id: '1',
        type: ActivityType.SPOT_ADDED,
        userId: 'user1',
        userName: 'Ahmet Yılmaz',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spotId: '1',
        action: ' Adding a new spot',
        description: 'Coffee Shop - "Newly opened cozy cafe in town!"',
        timestamp: new Date(now.getTime() - 1000 * 60 * 15),
        metadata: {}
      },
      {
        id: '2',
        type: ActivityType.SPOT_REVIEWED,
        userId: 'user2',
        userName: 'Ayşe Demir',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spotId: '2',
        action: 'Wrote a review',
        description: ' Pizza Place',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30),
        metadata: {
          rating: 5,
          reviewText: 'Best pizza in the city, highly recommend!'
        }
      },
      {
        id: '3',
        type: ActivityType.SPOT_VISITED,
        userId: 'user3',
        userName: 'Mehmet Kaya',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spotId: '3',
        action: 'visited',
        description: ' City Park',
        timestamp: new Date(now.getTime() - 1000 * 60 * 45),
        metadata: {}
      },
      {
        id: '4',
        type: ActivityType.SPOT_FAVORITED,
        userId: 'user4',
        userName: 'Fatma Öz',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spotId: '4',
        action: 'favorited',
        description: ' Art Museum',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60),
        metadata: {}
      },
      {
        id: '5',
        type: ActivityType.SPOT_SHARED,
        userId: 'user5',
        userName: 'Ali Şahin',
        userAvatar: 'https://images.unsplash.com/photo-1659714962352-434900f95a91?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spotId: '5',
        action: 'shared',
        description: ' AVM Center',
        timestamp: new Date(now.getTime() - 1000 * 60 * 90),
        metadata: {
          shareCount: 12
        }
      },
      {
        id: '6',
        type: ActivityType.USER_JOINED,
        userId: 'user6',
        userName: 'Zeynep Arslan',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        action: ' joined the community',
        timestamp: new Date(now.getTime() - 1000 * 60 * 120),
        metadata: {}
      }
    ];
  }
}