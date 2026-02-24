import { Component, OnInit, signal } from '@angular/core';
import { ActivityService } from '@core/services';
import { Activity } from '@core/models';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css',
  
})
    


export class ActivityListComponent implements OnInit {
  activities = signal<Activity[]>([]);
  limit = 10;

  constructor(private activityService: ActivityService) {} // ActivityService, aktiviteleri almak ve yönetmek için kullanılır, böylece kullanıcıların yaptığı aktiviteler bu servis üzerinden çekilerek görüntülenebilir

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getRecentActivities(this.limit).subscribe(activities => {
      this.activities.set(activities);
    });
  }

  getActivityText(activity: Activity): string {
    const spotName = activity.description || '';
    switch (activity.action) {
      case 'Adding a new spot':
        return `Adding a new spot:  <span class="spot-name">${spotName}</span>`;
      case 'Wrote a review':
        return ` wrote a review for <span class="spot-name">${spotName}</span>`;
      case 'visited':
        return ` visited <span class="spot-name">${spotName}</span>`;
      case 'favorited':
        return ` favorited <span class="spot-name">${spotName}</span>`;
      case 'shared':
        return ` shared <span class="spot-name">${spotName}</span>`;
      case 'joined the community':
        return 'joined the community';
      default:
        return activity.action;
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(timestamp).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now'; 
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
}