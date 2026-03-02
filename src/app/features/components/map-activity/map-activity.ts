// Harita-aktivite bölümü (wrapper) bileşeni — ana sayfada harita ve aktivite listesini yan yana gösterir
// SpotMapComponent ve ActivityListComponent'ı bir arada düzenleyen layout bileşeni
import { Component } from '@angular/core';
import { SpotMapComponent, MapSpot } from '../spot-map/spot-map'; // Harita bileşeni ve MapSpot arayüzü
import { ActivityListComponent } from '@layout/activity-list/activity-list'; // Aktivite listesi bileşeni

@Component({
  selector: 'app-map-activity-section',
  standalone: true,
  imports: [SpotMapComponent, ActivityListComponent], // İki çocuk bileşen bu wrapper tarafından import edilir
  templateUrl: './map-activity.html',
  styleUrl: './map-activity.css',
})
export class MapActivitySectionComponent {
  // Harita üzerinde bir spot seçildiğinde çalışır
  // Şu an boş handler — ileride spotlight detay paneli veya modal açma eklenebilir
  onSpotSelected(spot: MapSpot): void {
    // Spot selected handler
  }
}
