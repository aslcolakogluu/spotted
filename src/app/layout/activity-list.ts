import { Component, OnInit, signal } from '@angular/core';
import { ActivityService } from '@core/services';
import { Activity } from '@core/models';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [],
  template: `
    <section class="px-12 py-18">
      <div class="flex justify-between items-end mb-10">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 600; color: #eee8df;">
          Last <em style="font-style: italic; color: #c8a96e;">Activities</em>
        </h2>
        <a href="#" style="font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: #c8a96e; text-decoration: none; font-weight: 500; transition: opacity 0.2s;">All</a>
      </div>

      <!-- Activities -->
      @if (activities().length > 0) {
        <div class="flex flex-col gap-3">
          @for (activity of activities(); track activity.id) {
            <div class="activity-item flex items-center gap-3 p-3" style="background: #12141a; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; transition: all 0.2s;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #3a4550 0%, #2a3540 100%); flex-shrink: 0;"></div>
              <div class="flex-1" style="font-size: 0.85rem; color: rgba(238,232,223,0.45);">
                <strong style="color: #eee8df; font-weight: 500;">{{ activity.userName }}</strong> 
                <span [innerHTML]="getActivityText(activity)"></span>
              </div>
              <span style="font-size: 0.72rem; color: rgba(238,232,223,0.45);">{{ getTimeAgo(activity.timestamp) }}</span>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p style="color: rgba(238,232,223,0.45);">Henüz aktivite yok</p>
        </div>
      }
    </section>

    <style>
      .activity-item:hover {
        background: #181c26;
        border-color: rgba(200,169,110,0.15);
      }
      
      .activity-item :global(.spot-name) {
        color: #c8a96e;
      }
    </style>
  `,
  styles: []
})
export class ActivityListComponent implements OnInit {
  activities = signal<Activity[]>([]);
  limit = 10;

  constructor(private activityService: ActivityService) {}

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