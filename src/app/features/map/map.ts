import {
  Component,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotService } from '@core/services';
import { Spot, SpotType } from '@core/models';

declare const L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private spotService = inject(SpotService);

  searchQuery = '';
  activeSearchQuery = signal('');
  selectedCategory = signal<SpotType | null>(null);
  selectedSpot = signal<Spot | null>(null);
  sidebarCollapsed = signal(false);

  private allSpots = signal<Spot[]>([]);
  private map: any;
  private markers: any[] = [];
  private mapReady = signal(false);
  private userLocationMarker: any = null;

  readonly spotTypes = [
    { type: SpotType.NATURE, label: 'Nature', emoji: '' },
    { type: SpotType.PARK, label: 'Park', emoji: '' },
    { type: SpotType.BRIDGE, label: 'Bridge', emoji: '' },
    { type: SpotType.HISTORICAL, label: 'Historical', emoji: '' },
    { type: SpotType.MUSEUM, label: 'Museum', emoji: '' },
    { type: SpotType.BEACH, label: 'Beach', emoji: '' },
    { type: SpotType.SPORTS, label: 'Sports', emoji: '' },
    { type: SpotType.OTHER, label: 'Other', emoji: '' },
  ];

  // ✅ Filtered spots getter
  get filteredSpots(): Spot[] {
    let spots = this.allSpots();

    const cat = this.selectedCategory();
    if (cat) spots = spots.filter((s) => s.type === cat);

    const query = this.activeSearchQuery().trim().toLowerCase();
    if (query) {
      spots = spots.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query) ||
          (s.description && s.description.toLowerCase().includes(query)),
      );
    }

    return spots;
  }

  ngOnInit(): void {
    this.loadLeaflet();
    this.spotService.getSpots().subscribe((spots) => {
      console.log('Spots loaded:', spots);
      this.allSpots.set(spots);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadLeaflet(): void {
    if (typeof window !== 'undefined' && !(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setTimeout(() => this.initMap(), 100);
      };
      document.body.appendChild(script);
    }
  }

  private initMap(): void {
    if (typeof window === 'undefined' || !(window as any).L || this.map) return;

    const L = (window as any).L;

    // ✅ Zoom controls disabled
    this.map = L.map('map', {
      zoomControl: false,
    }).setView([39.9334, 32.8597], 12);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      },
    ).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
      this.mapReady.set(true);
      console.log('Map initialized');
      this.updateMarkers(); // ✅ İlk marker'ları ekle
    }, 100);
  }

  private updateMarkers(): void {
    if (!this.map) {
      console.log('Map not ready yet');
      return;
    }

    const L = (window as any).L;
    if (!L) return;

    // Eski marker'ları temizle
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    const spots = this.filteredSpots;
    console.log('Updating markers for spots:', spots.length);

    spots.forEach((spot, index) => {
      // ✅ Aktif spot ise yeşil, değilse sarı
      const isActive = this.selectedSpot()?.id === spot.id;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker', // ✅ Unique class
        html: `
        <div class="marker-pin ${isActive ? 'active' : ''}">
          ${index + 1}
        </div>
      `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: customIcon,
      })
        .addTo(this.map)
        .on('click', () => {
          console.log('Marker clicked:', spot.name);
          this.selectSpotByClick(spot);
          // Marker'ları yeniden çiz (renk değişimi için)
          this.updateMarkers();
        });

      this.markers.push(marker);
    });

    // Tüm marker'ları gösterecek şekilde zoom
    if (spots.length > 0 && this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
  setCategory(type: SpotType | null): void {
    this.selectedCategory.set(type);
    this.updateMarkers(); // ✅ Marker'ları güncelle
  }

  // ✅ Enter'a basınca çağrılır
  onSearchSubmit(): void {
    console.log('Search submitted:', this.searchQuery);
    this.activeSearchQuery.set(this.searchQuery);
    this.updateMarkers();
  }

  selectSpot(spot: Spot): void {
    this.selectedSpot.set(spot);
    if (this.map) {
      this.map.setView([spot.latitude, spot.longitude], 15, {
        animate: true,
        duration: 0.5,
      });
    }
  }

  selectSpotByClick(spot: Spot): void {
    this.selectedSpot.set(spot);
  }

  closeCard(): void {
    this.selectedSpot.set(null);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((val) => !val);
  }

  myLocation(): void {
    if (!navigator.geolocation || !this.map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const L = (window as any).L;

        if (this.userLocationMarker) {
          this.map.removeLayer(this.userLocationMarker);
        }

        const userIcon = L.divIcon({
          className: 'leaflet-div-icon',
          html: `
            <div class="user-location-marker">
              <div class="pulse"></div>
              <div class="user-pin"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        this.userLocationMarker = L.marker([latitude, longitude], {
          icon: userIcon,
        })
          .addTo(this.map)
          .bindPopup('<strong>Your Location</strong>')
          .openPopup();

        this.map.setView([latitude, longitude], 15, {
          animate: true,
          duration: 1,
        });
      },
      (error) => {
        console.error('Your location error:', error);
        alert('Location access denied or unavailable.');
      },
    );
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeSearchQuery.set(''); // ✅ Aktif query'yi temizle
    this.selectedCategory.set(null);
    this.selectedSpot.set(null);
    this.updateMarkers(); // ✅ Marker'ları güncelle
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating));
  }

  getSpotTypeEmoji(type: SpotType): string {
    const found = this.spotTypes.find((t) => t.type === type);
    return found?.emoji || '';
  }

  getSpotTypeLabel(type: SpotType): string {
    const found = this.spotTypes.find((t) => t.type === type);
    return found?.label || 'Other';
  }

  // ✅ Component class'ın içine ekle
  private spotBestTimes = new Map<string, string>();

  // ✅ getBestTime metodunu değiştir
  getBestTime(spot: Spot): string {
    // Eğer daha önce bu spot için saat oluşturulmuşsa, aynısını döndür
    if (this.spotBestTimes.has(spot.id)) {
      return this.spotBestTimes.get(spot.id)!;
    }

    // İlk kez oluşturuluyor, kaydet
    const times = ['07:00-09:00', '12:00-14:00', '17:00-19:00', '20:00-22:00'];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    this.spotBestTimes.set(spot.id, randomTime);

    return randomTime;
  }

  // ✅ Aynı şekilde distance için de
  private spotDistances = new Map<string, string>();

  calculateDistance(spot: Spot): string {
    if (this.spotDistances.has(spot.id)) {
      return this.spotDistances.get(spot.id)!;
    }

    const distance = (Math.random() * 5 + 0.5).toFixed(1) + ' km';
    this.spotDistances.set(spot.id, distance);

    return distance;
  }
}
