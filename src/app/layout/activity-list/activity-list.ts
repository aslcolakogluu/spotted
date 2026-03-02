// Aktivite listesi bileşeni — ana sayfada kullanıcı aktivitelerini kronolojik olarak gösterir
// Son 10 aktivite varsayılan olarak yüklenir
import { Component, OnInit, signal } from '@angular/core';
import { ActivityService } from '@core/services'; // Aktiviteleri çeken servis
import { Activity } from '@core/models';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css',
})
export class ActivityListComponent implements OnInit {
  activities = signal<Activity[]>([]); // Servisten gelen aktiviteler, reaktif olarak React-like state tutuluyor
  limit = 10; // Gösterilecek maksimum aktivite sayısı

  constructor(private activityService: ActivityService) { } // ActivityService, aktiviteleri almak ve yönetmek için kullanılır

  // Bileşen başlatıldığında aktiviteler yüklenir
  ngOnInit(): void {
    this.loadActivities();
  }

  // ActivityService üzerinden en son aktiviteleri çeker
  loadActivities(): void {
    this.activityService.getRecentActivities(this.limit).subscribe(activities => {
      this.activities.set(activities); // Gelen veriyi sinyal durumuna kaydeder
    });
  }

  // Aktivite türüne göre HTML içeren açıklama metni üretir
  // Mekan adı <span> ile renklendirilir
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
        return activity.action; // Bilinmeyen aksiyon türünde ham değeri göster
    }
  }

  // Zaman damgasını kullanıcı dostu "X dakika önce" formatına dönüştürür
  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(timestamp).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';          // 1 dakikadan az
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`; // 1-59 dakika

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`; // 1-23 saat

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`; // 1+ gün
  }
}