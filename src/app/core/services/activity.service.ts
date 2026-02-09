import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Activity, ActivityType, ActivityFilter } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities = signal<Activity[]>(this.generateMockActivities());
  readonly activities$ = this.activities.asReadonly();

  constructor() {}

  getActivities(filter?: ActivityFilter): Observable<Activity[]> {
    let filtered = this.activities();

    if (filter) {
      if (filter.type?.length) {
        filtered = filtered.filter(a => filter.type!.includes(a.type));
      }

      if (filter.userId) {
        filtered = filtered.filter(a => a.userId === filter.userId);
      }

      if (filter.spotId) {
        filtered = filtered.filter(a => a.spotId === filter.spotId);
      }

      if (filter.startDate) {
        filtered = filtered.filter(a => new Date(a.timestamp) >= filter.startDate!);
      }

      if (filter.endDate) {
        filtered = filtered.filter(a => new Date(a.timestamp) <= filter.endDate!);
      }

      if (filter.limit) {
        filtered = filtered.slice(0, filter.limit);
      }
    }

    return of(filtered).pipe(delay(300));
  }

  getRecentActivities(limit: number = 10): Observable<Activity[]> {
    const recent = [...this.activities()]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return of(recent).pipe(delay(200));
  }

  getUserActivities(userId: string, limit?: number): Observable<Activity[]> {
    let userActivities = this.activities().filter(a => a.userId === userId);
    
    if (limit) {
      userActivities = userActivities.slice(0, limit);
    }

    return of(userActivities).pipe(delay(300));
  }

  getSpotActivities(spotId: string, limit?: number): Observable<Activity[]> {
    let spotActivities = this.activities().filter(a => a.spotId === spotId);
    
    if (limit) {
      spotActivities = spotActivities.slice(0, limit);
    }

    return of(spotActivities).pipe(delay(300));
  }

  addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Observable<Activity> {
    const newActivity: Activity = {
      ...activity,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.activities.update(activities => [newActivity, ...activities]);
    return of(newActivity).pipe(delay(200));
  }

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMockActivities(): Activity[] {
    const now = new Date();
    
    return [
      {
        id: '1',
        type: ActivityType.SPOT_ADDED,
        userId: 'user1',
        userName: 'Ahmet Yılmaz',
        userAvatar: '/assets/avatars/user1.jpg',
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
        userAvatar: '/assets/avatars/user2.jpg',
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
        userAvatar: '/assets/avatars/user3.jpg',
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
        userAvatar: '/assets/avatars/user4.jpg',
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
        userAvatar: '/assets/avatars/user5.jpg',
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
        userAvatar: '/assets/avatars/user6.jpg',
        action: ' joined the community',
        timestamp: new Date(now.getTime() - 1000 * 60 * 120),
        metadata: {}
      }
    ];
  }
}