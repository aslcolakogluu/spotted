import { Component, OnInit, signal } from '@angular/core';
import { ActivityService } from '@core/services';
import { Activity } from '@core/models';
import { ActivityItemComponent } from '@shared/activity-item';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [ActivityItemComponent],
  template: `
    <section class="py-16 px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              Son Aktiviteler
            </h2>
            <p class="text-gray-600">
              Topluluğumuzda neler oluyor, hemen keşfet
            </p>
          </div>

          <button class="hidden md:flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="font-medium">Yenile</span>
          </button>
        </div>

        <!-- Activities -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          @if (activities().length > 0) {
            <div class="divide-y divide-gray-100">
              @for (activity of activities(); track activity.id) {
                <app-activity-item 
                  [activity]="activity">
                </app-activity-item>
              }
            </div>
          } @else {
            <!-- Empty State -->
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Henüz aktivite yok</h3>
              <p class="text-gray-600">İlk aktiviteyi sen oluştur!</p>
            </div>
          }
        </div>

        <!-- View More Button -->
        @if (activities().length > 0 && activities().length >= limit) {
          <div class="text-center mt-8">
            <button 
              (click)="loadMore()"
              class="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
              Daha Fazla Göster
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        }
      </div>
    </section>
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

  loadMore(): void {
    this.limit += 10;
    this.loadActivities();
  }
}