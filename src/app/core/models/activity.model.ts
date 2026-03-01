import { Spot } from './spot.model'; //Spot modelini import ediyoruz çünkü Activity modelinde Spot ile ilgili bilgiler de olacak

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  spotId?: string;
  spot?: Spot;
  action: string;
  description?: string;
  timestamp: Date;
  metadata?: ActivityMetadata;
}

export enum ActivityType {
  SPOT_ADDED = 'spot_added',
  SPOT_REVIEWED = 'spot_reviewed',
  SPOT_VISITED = 'spot_visited',
  SPOT_FAVORITED = 'spot_favorited',
  SPOT_SHARED = 'spot_shared',
  USER_JOINED = 'user_joined'
}

export interface ActivityMetadata {
  rating?: number;
  reviewText?: string;
  photoUrls?: string[];
  shareCount?: number;
  [key: string]: any;  // key değeri string, value ise herhangi bir tür olabilir
}

export interface ActivityFilter {
  type?: ActivityType[]; 
  userId?: string;
  spotId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}