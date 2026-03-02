// Map (harita) bileşeni — tüm mekanları interaktif bir harita üzerinde görüntüler
// Leaflet.js CDN ile dinamik olarak yüklenir; mekan seçimi, kategori ve arama filtreleri içerir
import {
  Component,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms'; // Arama inputu için ngModel bağlaması
import { SpotService } from '@core/services';
import { Spot, SpotType } from '@core/models';
import { SPOT_TYPES, getSpotTypeIcon, getSpotTypeLabel as getLabel } from '@shared/constants/spot-type-icons';

// Leaflet harita kütüphanesi global scope'tan (CDN) erişilir
declare const L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
// OnInit: Leaflet yükleme ve spot aboneliği, AfterViewInit: harita DOM'a bağlama, OnDestroy: temizleme
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private spotService = inject(SpotService); // Mekan verilerini çeken servis

  searchQuery = '';                                   // Arama inputundaki anlık metin (ngModel ile bağlı)
  activeSearchQuery = signal('');                    // Enter'a basılınca aktif hale gelen filtre sorgusu
  selectedCategory = signal<SpotType | null>(null); // Aktif kategori filtresi (null = tümü)
  selectedSpot = signal<Spot | null>(null);          // Sidebar'da detayları gösterilen seçili mekan
  sidebarCollapsed = signal(false);                 // Sidebar açık/kapalı durumu

  private allSpots = signal<Spot[]>([]);    // Servisten gelen tüm mekanların listesi
  private map: any;                         // Leaflet harita nesnesi
  private markers: any[] = [];              // Haritadaki tüm marker referansları
  private mapReady = signal(false);        // Harita başlatıldıktan sonra true olur
  private userLocationMarker: any = null;  // "Konumum" marker'ının referansı
  private markersInitialized = false;      // fitBounds'un yalnızca bir kez çalışmasını sağlar

  readonly spotTypes = SPOT_TYPES; // Kategori butonlarını oluşturmak için kullanılır

  // Kategori ve arama filtrelerine göre dinamik mekan listesi
  // Angular change detection ile her sinyal değişiminde yeniden hesaplanır
  get filteredSpots(): Spot[] {
    let spots = this.allSpots();

    // Kategori filtresi
    const cat = this.selectedCategory();
    if (cat) spots = spots.filter((s) => s.type === cat);

    // Arama filtresi — isim, adres veya açıklamada arama yapar (büyük-küçük harf duyarsız)
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
  // Bu sayede marker oluşturma sırasında değişken bir liste yerine anlık snapshot kullanılır
  private _markerSpots: Spot[] = [];

  // filteredSpots'un anlık kopyasını _markerSpots'a alır
  private refreshFilteredSpots(): void {
    this._markerSpots = this.filteredSpots;
  }

  // Bileşen başlatıldığında: Leaflet yüklenir ve SpotService'e abone olunur
  ngOnInit(): void {
    this.loadLeaflet();
    this.spotService.getSpots().subscribe((spots) => {
      this.allSpots.set(spots);
      // Harita zaten hazırsa spot verisi gelince hemen marker'ları ekle
      if (this.map) {
        this.updateMarkers();
      }
    });
  }

  // DOM yüklendikten sonra haritayı başlat (100ms gecikme ile CSS hesaplamalarının tamamlanmasını bekler)
  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  // Bileşen yok edilirken harita kaynakları serbest bırakılır (bellek sızıntısını önler)
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // Leaflet CSS ve JS'ini CDN üzerinden dinamik olarak yükler
  // window.L henüz yoksa script ve link elemanları oluşturulup DOM'a eklenir
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

  // Leaflet haritasını 'map' elementine bağlar, tile layer ve zoom kontrollerini ayarlar
  private initMap(): void {
    if (typeof window === 'undefined' || !(window as any).L || this.map) return;

    const L = (window as any).L;

    // Zoom kontrolleri devre dışı — özel UI butonları kullanılır
    this.map = L.map('map', {
      zoomControl: false,
    }).setView([39.9334, 32.8597], 12); // Ankara merkezi

    // CARTO dark harita katmanı
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      },
    ).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize(); // Boyut tutarsızlığını düzelt
      this.mapReady.set(true);
      this.updateMarkers(); // Spotlar zaten yüklüyse hemen ekle
    }, 100);
  }

  // Filtrelenmiş mekan listesine göre harita marker'larını günceller
  // Önce eski marker'lar kaldırılır, sonra yeni marker'lar eklenir
  private updateMarkers(): void {
    if (!this.map) return;

    const L = (window as any).L;
    if (!L) return;

    // Snapshot'ı kilitle — marker numaraları liste ile eşleşir
    this.refreshFilteredSpots();
    const spots = this._markerSpots;

    // Spotlar henüz yüklenmediyse 500ms sonra tekrar dene
    if (spots.length === 0 && this.allSpots().length === 0) {
      setTimeout(() => this.updateMarkers(), 500);
      return;
    }

    // Eski marker'ları haritadan kaldır
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    // Her mekan için numaralı marker ekle
    spots.forEach((spot, index) => {
      const isActive = this.selectedSpot()?.id === spot.id; // Seçili mekan marker'ı vurgulanır

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="marker-pin ${isActive ? 'active' : ''}">${index + 1}</div>`, // Sayısal etiket
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: customIcon,
      })
        .addTo(this.map)
        .on('click', () => {
          this.selectSpotByClick(spot); // Marker'a tıklandığında mekan seçilir
        });

      this.markers.push(marker);
    });

    // İlk yüklemede tüm marker'ların görünebileceği şekilde haritayı sığdır
    if (!this.markersInitialized && spots.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1)); // %10 dolgu ekle
      this.markersInitialized = true; // Bir kez çalıştıktan sonra tekrar çalışmaması için işaretle
    }
  }

  // Kategori filtresini günceller ve marker'ları yeniden çizer
  setCategory(type: SpotType | null): void {
    this.selectedCategory.set(type);
    this.updateMarkers();
  }

  // Arama butonuna veya Enter'a basılınca aktif sorguyu günceller
  onSearchSubmit(): void {
    this.activeSearchQuery.set(this.searchQuery);
    this.updateMarkers();
  }

  // Sidebar listesinden mekan seçildiğinde haritayı o konuma yakınlaştırır
  selectSpot(spot: Spot): void {
    this.selectedSpot.set(spot);
    this.updateMarkers(); // Seçili marker rengini güncelle
    if (this.map) {
      this.map.setView([spot.latitude, spot.longitude], 15, {
        animate: true,
        duration: 0.6,
      });
      // Sidebar görünürken marker'ı ortalamak için haritayı 202px sola kaydır
      if (!this.sidebarCollapsed()) {
        setTimeout(() => this.map.panBy([-202, 0], { animate: false }), 50);
      }
    }
  }

  // Harita marker'ına tıklanarak mekan seçildiğinde çalışır (selectSpot ile aynı mantık)
  selectSpotByClick(spot: Spot): void {
    this.selectedSpot.set(spot);
    this.updateMarkers(); // Seçili marker rengini güncelle
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

  // Seçili mekan kartını kapatır
  closeCard(): void {
    this.selectedSpot.set(null);
  }

  // Sidebar'ı açar/kapatır (toggle)
  toggleSidebar(): void {
    this.sidebarCollapsed.update((val) => !val);
  }

  // Tarayıcının Geolocation API'sini kullanarak kullanıcının konumunu haritada gösterir
  myLocation(): void {
    if (!navigator.geolocation || !this.map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const L = (window as any).L;

        // Önceki konum marker'ını kaldır
        if (this.userLocationMarker) {
          this.map.removeLayer(this.userLocationMarker);
        }

        // Animasyonlu pulse efektli özel kullanıcı konumu marker'ı
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

        // Kullanıcının konumuna smooth animasyon ile yakınlaştır
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

  // Tüm filtreleri ve seçimleri temizler, haritayı tüm mekanları gösterecek şekilde sıfırlar
  clearFilters(): void {
    this.searchQuery = '';
    this.activeSearchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedSpot.set(null);
    this.markersInitialized = false; // fitBounds tekrar çalışsın
    this.updateMarkers();
  }

  // Puan değerini dolu yıldızlara dönüştürür
  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating));
  }

  // Mekan türü için SVG ikon string'i döndürür
  getSpotTypeIcon(type: SpotType): string {
    return getSpotTypeIcon(type);
  }

  // Mekan türü için okunabilir etiket döndürür (örn: SpotType.PARK → "Park")
  getSpotTypeLabel(type: SpotType): string {
    return getLabel(type);
  }

  // Her mekan için deterministik en iyi ziyaret saatini saklar
  // Map kullanılarak aynı mekan için her seferinde aynı sonuç döner (Random değişmez)
  private spotBestTimes = new Map<string, string>();

  // Mekan için en iyi ziyaret saatini döndürür — ilk çağrıda rastgele seçilir ve saklanır
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

  // Her mekan için deterministik tahmini mesafeyi saklar (gerçek GPS yerine simülasyon)
  private spotDistances = new Map<string, string>();

  // Mekana olan tahmini mesafeyi döndürür — ilk çağrıda rastgele hesaplanır ve saklanır
  calculateDistance(spot: Spot): string {
    if (this.spotDistances.has(spot.id)) {
      return this.spotDistances.get(spot.id)!;
    }

    // 0.5-5.5km arası rastgele mesafe (gerçek GPS yerine mock veri)
    const distance = (Math.random() * 5 + 0.5).toFixed(1) + ' km';
    this.spotDistances.set(spot.id, distance);

    return distance;
  }
}
