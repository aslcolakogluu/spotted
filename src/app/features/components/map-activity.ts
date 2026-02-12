import { Component } from '@angular/core';
import { SpotMapComponent, MapSpot } from '../components/spot-map';
import { ActivityListComponent } from '@layout/activity-list';

@Component({
  selector: 'app-map-activity-section',
  standalone: true,
  imports: [SpotMapComponent, ActivityListComponent],
  template: `
    <section class="map-activity-section">
      <div class="section-header">
        <h2>
          Map <em>& Activities</em>
        </h2>
      </div>

      <div class="two-col">
        <app-spot-map
          (spotSelected)="onSpotSelected($event)"
        />

        <app-activity-list />
      </div>
    </section>

    <style>
      .map-activity-section {
        padding: 72px 48px;
        background: #12141a;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 40px;
      }

      .section-header h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.9rem;
        font-weight: 600;
        color: #eee8df;
      }

      .section-header h2 em {
        font-style: italic;
        color: #c8a96e;
      }

      .two-col {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 24px;
        align-items: stretch;
      }

      @media (max-width: 900px) {
        .map-activity-section {
          padding: 48px 20px;
        }

        .two-col {
          grid-template-columns: 1fr;
          gap: 32px;
        }
      }
    </style>
  `,
})
export class MapActivitySectionComponent {
  onSpotSelected(spot: MapSpot): void {
    console.log('Selected Spot:', spot.name);
  }
}