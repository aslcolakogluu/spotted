import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Stats, UserStats, TrendingStats, CategoryStat } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private stats = signal<Stats>(this.generateMockStats());
  readonly stats$ = this.stats.asReadonly();

  constructor() {}

  getOverallStats(): Observable<Stats> {
    return of(this.stats()).pipe(delay(300));
  }

  getUserStats(userId: string): Observable<UserStats> {
    return of(this.generateMockUserStats(userId)).pipe(delay(300));
  }

  getTrendingStats(): Observable<TrendingStats> {
    return of(this.generateMockTrendingStats()).pipe(delay(300));
  }

  getCategoryStats(): Observable<CategoryStat[]> {
    return of(this.stats().popularCategories).pipe(delay(200));
  }

  updateStats(): void {
    this.stats.set(this.generateMockStats());
  }

  private generateMockStats(): Stats {
    return {
      totalSpots: 1247,
      totalUsers: 8934,
      totalReviews: 5621,
      totalVisits: 23456,
      averageRating: 4.3,
      popularCategories: [
        {
          category: 'Cafe',
          count: 342,
          percentage: 27.4,
          trend: 'up'
        },
        {
          category: 'Restaurant',
          count: 298,
          percentage: 23.9,
          trend: 'up'
        },
        {
          category: 'Park',
          count: 186,
          percentage: 14.9,
          trend: 'stable'
        },
        {
          category: 'Shopping',
          count: 154,
          percentage: 12.4,
          trend: 'down'
        },
        {
          category: 'Museum',
          count: 127,
          percentage: 10.2,
          trend: 'up'
        },
        {
          category: 'Entertainment',
          count: 98,
          percentage: 7.9,
          trend: 'stable'
        },
        {
          category: 'Other',
          count: 42,
          percentage: 3.4,
          trend: 'stable'
        }
      ],
      recentActivity: this.generateActivityStats()
    };
  }

  private generateActivityStats(): Array<{ date: string; spotsAdded: number; reviewsPosted: number; visits: number }> {
    const days = 7;
    const stats = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      stats.push({
        date: date.toISOString().split('T')[0],
        spotsAdded: Math.floor(Math.random() * 20) + 5,
        reviewsPosted: Math.floor(Math.random() * 50) + 10,
        visits: Math.floor(Math.random() * 200) + 50
      });
    }

    return stats;
  }

  private generateMockUserStats(userId: string): UserStats {
    return {
      userId,
      spotsAdded: 23,
      spotsVisited: 87,
      reviewsWritten: 45,
      favoriteCount: 62,
      followersCount: 134,
      followingCount: 98,
      memberSince: new Date('2023-06-15'),
      badges: [
        {
          id: 'explorer',
          name: 'Explorer',
          description: '50 different spots visited',
          iconUrl: '/assets/badges/explorer.svg',
          earnedAt: new Date('2023-12-10'),
          rarity: 'rare'
        },
        {
          id: 'reviewer',
          name: 'Reviewer',
          description: '25 reviews written',
          iconUrl: '/assets/badges/reviewer.svg',
          earnedAt: new Date('2024-01-05'),
          rarity: 'common'
        },
        {
          id: 'contributor',
          name: 'Contributor',
          description: '10 spots added',
          iconUrl: '/assets/badges/contributor.svg',
          earnedAt: new Date('2023-09-20'),
          rarity: 'epic'
        }
      ]
    };
  }

  private generateMockTrendingStats(): TrendingStats {
    return {
      trendingSpots: [
        {
          spotId: '1',
          spotName: 'Cafe Shop',
          trendScore: 95,
          recentVisits: 234,
          growthRate: 45.5
        },
        {
          spotId: '2',
          spotName: 'Pizza Restaurant',
          trendScore: 89,
          recentVisits: 198,
          growthRate: 38.2
        },
        {
          spotId: '4',
          spotName: 'Art Gallery',
          trendScore: 82,
          recentVisits: 156,
          growthRate: 32.1
        }
      ],
      hotCategories: ['Cafe', 'Restaurant', 'Museum'],
      topContributors: [
        {
          userId: 'user1',
          userName: 'Ahmet Yılmaz',
          userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          contributionScore: 892,
          spotsAdded: 45,
          reviewsCount: 123
        },
        {
          userId: 'user2',
          userName: 'Ayşe Demir',
          userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          contributionScore: 756,
          spotsAdded: 38,
          reviewsCount: 98
        },
        {
          userId: 'user3',
          userName: 'Mehmet Kaya',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          contributionScore: 634,
          spotsAdded: 32,
          reviewsCount: 87
        }
      ]
    };
  }
}