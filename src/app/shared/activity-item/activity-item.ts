import { Component, Input, input } from '@angular/core';
import { Activity, ActivityType } from '@core/models';

@Component({
  selector: 'app-activity-item',
  standalone: true,
  imports: [],
  templateUrl: './activity-item.html',
  styleUrl: './activity-item.css',
})
export class ActivityItemComponent {
  @Input() activity!: Activity;

  // ✅ Enum'u template'de kullanabilmek için
  ActivityType = ActivityType;

  getUserInitials(): string {
    const names = this.activity.userName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.activity.userName.substring(0, 2).toUpperCase();
  }

  hasMetadata(): boolean { // Aktivitenin metadata'sının olup olmadığını kontrol eder, böylece sadece rating veya share count içeren aktiviteler için metadata bölümü gösterilir
    return !!(this.activity.metadata && 
      (this.activity.metadata.rating || this.activity.metadata.shareCount)); // Metadata varsa ve içinde rating veya shareCount varsa true döner, böylece kullanıcılar aktivitelerin detaylarını görebilirler
  }

  getTimeAgo(): string {
    const now = new Date();
    const timestamp = new Date(this.activity.timestamp);
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getIconContainerClass(): string {
    const baseClass = 'w-8 h-8 rounded-full flex items-center justify-center';
    
    const colorClasses: Record<ActivityType, string> = {
      [ActivityType.SPOT_ADDED]: 'bg-green-100 text-green-600',
      [ActivityType.SPOT_REVIEWED]: 'bg-blue-100 text-blue-600',
      [ActivityType.SPOT_VISITED]: 'bg-purple-100 text-purple-600',
      [ActivityType.SPOT_FAVORITED]: 'bg-red-100 text-red-600',
      [ActivityType.SPOT_SHARED]: 'bg-yellow-100 text-yellow-600',
      [ActivityType.USER_JOINED]: 'bg-indigo-100 text-indigo-600'
    };

    return `${baseClass} ${colorClasses[this.activity.type]}`; // Aktivite türüne göre farklı renkler atanır, böylece kullanıcılar aktiviteleri türlerine göre hızlıca ayırt edebilirler
  }

  
}