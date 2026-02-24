import { Component } from '@angular/core';
import { SpotMapComponent, MapSpot } from '../spot-map/spot-map';
import { ActivityListComponent } from '@layout/activity-list/activity-list';

@Component({
  selector: 'app-map-activity-section',
  standalone: true,
  imports: [SpotMapComponent, ActivityListComponent],
  templateUrl: './map-activity.html',
  styleUrl: './map-activity.css',
    
 
    
})
export class MapActivitySectionComponent {
  onSpotSelected(spot: MapSpot): void {
    console.log('Selected Spot:', spot.name);
  }
}
