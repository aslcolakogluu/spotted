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
  private markersInitialized = false;

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

  // Template için her zaman güncel liste (Angular change detection ile uyumlu)
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

  // Marker'lar için sabit snapshot — updateMarkers içinde set edilir
  private _markerSpots: Spot[] = [];

  private refreshFilteredSpots(): void {
    this._markerSpots = this.filteredSpots;
  }

  ngOnInit(): void {
    this.loadLeaflet();
    this.spotService.getSpots().subscribe((spots) => {
      console.log('Spots loaded:', spots);
      this.allSpots.set(spots);
      // Map zaten hazırsa hemen marker'ları ekle
      if (this.map) {
        this.updateMarkers();
      }
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
      console.log('Map initialized, spots count:', this.allSpots().length);
      this.updateMarkers(); // Spotlar zaten yüklüyse hemen ekle
    }, 100);
  }

  private updateMarkers(): void {
    if (!this.map) return;

    const L = (window as any).L;
    if (!L) return;

    // Snapshot'ı kilitle — marker numaraları liste ile eşleşir
    this.refreshFilteredSpots();
    const spots = this._markerSpots;

    if (spots.length === 0 && this.allSpots().length === 0) {
      setTimeout(() => this.updateMarkers(), 500);
      return;
    }

    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    spots.forEach((spot, index) => {
      const isActive = this.selectedSpot()?.id === spot.id;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="marker-pin ${isActive ? 'active' : ''}">${index + 1}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: customIcon,
      })
        .addTo(this.map)
        .on('click', () => {
          this.selectSpotByClick(spot);
        });

      this.markers.push(marker);
    });

    if (!this.markersInitialized && spots.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
      this.markersInitialized = true;
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
    this.updateMarkers(); // renk güncelle
    if (this.map) {
      this.map.setView([spot.latitude, spot.longitude], 15, {
        animate: true,
        duration: 0.6,
      });
      // Sidebar offset: görünür alanın ortasına almak için sağa kaydır
      if (!this.sidebarCollapsed()) {
        setTimeout(() => this.map.panBy([-202, 0], { animate: false }), 50);
      }
    }
  }

  selectSpotByClick(spot: Spot): void {
    this.selectedSpot.set(spot);
    this.updateMarkers(); // renk güncelle
    if (this.map) {
      this.map.setView([spot.latitude, spot.longitude], 15, {
        animate: true,
        duration: 0.6,
      });
      if (!this.sidebarCollapsed()) {
        setTimeout(() => this.map.panBy([-202, 0], { animate: false }), 50);
      }
    }
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
    this.activeSearchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedSpot.set(null);
    this.markersInitialized = false; // fitBounds tekrar çalışsın
    this.updateMarkers();
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
