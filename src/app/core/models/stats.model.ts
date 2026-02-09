export interface Stats {
  totalSpots: number;
  totalUsers: number;
  totalReviews: number;
  totalVisits: number;
  averageRating: number;
  popularCategories: CategoryStat[];
  recentActivity: ActivityStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ActivityStat {
  date: string;
  spotsAdded: number;
  reviewsPosted: number;
  visits: number;
}

export interface UserStats {
  userId: string;
  spotsAdded: number;
  spotsVisited: number;
  reviewsWritten: number;
  favoriteCount: number;
  followersCount: number;
  followingCount: number;
  memberSince: Date;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface TrendingStats {
  trendingSpots: TrendingSpot[];
  hotCategories: string[];
  topContributors: TopContributor[];
}

export interface TrendingSpot {
  spotId: string;
  spotName: string;
  trendScore: number;
  recentVisits: number;
  growthRate: number;
}

export interface TopContributor {
  userId: string;
  userName: string;
  userAvatar?: string;
  contributionScore: number;
  spotsAdded: number;
  reviewsCount: number;
}