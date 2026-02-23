import {Component,inject,computed,signal,OnInit,AfterViewInit,OnDestroy,effect,} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotService } from '@core/services';
import { Spot, SpotType } from '@core/models';


declare const L: any; // Leaflet global variable, böylece TypeScript derleyicisi L'nin var olduğunu bilir ve hata vermez

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy{
  private spotService = inject(SpotService);

  searchQuery = '';
  selectedCategory = signal<SpotType | null>(null); // Seçilen kategori, başlangıçta null olarak ayarlanır, böylece tüm kategoriler gösterilir, kullanıcı bir kategori seçtiğinde bu sinyal güncellenir ve harita buna göre filtrelenir
  selectedSpot = signal<Spot | null>(null);  // Seçilen spot, başlangıçta null olarak ayarlanır, böylece hiçbir spot seçili olmaz, kullanıcı bir marker'a tıkladığında bu sinyal güncellenir ve detay kartı gösterilir, kullanıcı kartı kapattığında tekrar null yapılır ve detay kartı gizlenir
  sidebarCollapsed = signal(false); // Kenar çubuğunun açık mı kapalı mı olduğunu tutan sinyal, başlangıçta false olarak ayarlanır yani kenar çubuğu açık olur, kullanıcı toggleSidebar fonksiyonunu çağırdığında bu sinyal güncellenir ve kenar çubuğu açılıp kapanır
 
  private allSpots = signal<Spot[]>([]); // Tüm spot'ları tutan sinyal, başlangıçta boş bir dizi olarak ayarlanır, ngOnInit'de SpotService üzerinden spot'lar yüklendiğinde bu sinyal güncellenir ve harita ile liste buna göre güncellenir
  private map: any; // Leaflet haritasını tutan değişken, böylece harita üzerinde işlemler yaparken bu değişkene erişilir, örneğin marker eklemek veya harita merkezini değiştirmek gibi işlemler için kullanılır
  private markers: any[] = []; // Harita üzerinde gösterilen marker'ları tutan dizi, böylece marker'lar güncellenirken önce eski marker'lar kaldırılır ve yeni marker'lar eklenir, böylece harita her zaman güncel spot'ları gösterir
  private mapReady = signal(false); // Haritanın hazır olup olmadığını tutan sinyal, başlangıçta false olarak ayarlanır, harita yüklendiğinde bu sinyal true yapılır ve harita ile ilgili işlemler bu sinyalin durumuna göre gerçekleştirilir, böylece harita hazır olmadan marker eklemek gibi hataların önüne geçilir
  private userLocationMarker: any = null; // Kullanıcının konumunu gösteren marker, başlangıçta null olarak ayarlanır, kullanıcı konumunu paylaşmayı kabul ettiğinde bu değişken güncellenir ve haritaya eklenir, kullanıcı tekrar konumunu göstermek istediğinde eski marker kaldırılır ve yeni marker eklenir, böylece harita her zaman kullanıcının güncel konumunu gösterir

  readonly spotTypes = [
    { type: SpotType.NATURE, label: 'Nature', emoji: '' },
    { type: SpotType.PARK, label: 'Park', emoji: '' },
    { type: SpotType.BRIDGE, label: 'Bridge', emoji: '' },
    { type: SpotType.HISTORICAL, label: 'Historical', emoji: '' },
    { type: SpotType.MUSEUM, label: 'Museum', emoji: '' },
    { type: SpotType.BEACH, label: 'Beach', emoji: '' },
    { type: SpotType.SPORTS, label: 'Sports', emoji: '' },
    { type: SpotType.OTHER, label: 'Other', emoji: '📍' },
  ];

  filteredSpots = computed(() => {
    let spots = this.allSpots();

    const cat = this.selectedCategory();
    if (cat) spots = spots.filter((s) => s.type === cat);

    const query = this.searchQuery.trim().toLowerCase(); // Arama sorgusu boşluklardan temizlenir ve küçük harfe çevrilir, böylece arama büyük/küçük harf duyarsız olur
    if (query) {
      spots = spots.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query),
      );
    }

    return spots;
  });
getBestTime: any;
calculateDistance: any;

  constructor() { // Harita hazır olduğunda ve filtrelenmiş spot'lar değiştiğinde marker'ları güncellemek için bir effect oluşturulur, böylece kullanıcı filtreleri değiştirdiğinde veya harita yüklendiğinde harita her zaman güncel spot'ları gösterir
    effect(() => {
      if (this.mapReady() && this.filteredSpots().length > 0) { // Harita hazırsa ve filtrelenmiş spot'lar varsa, marker'lar güncellenir, böylece kullanıcı filtreleri değiştirdiğinde veya harita yüklendiğinde harita her zaman güncel spot'ları gösterir
        this.updateMarkers();
      }
    });
  }

  ngOnInit(): void {
    this.loadLeaflet();

    this.spotService.getSpots().subscribe((spots) => {
      console.log('Spots loaded:', spots);
      this.allSpots.set(spots);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100); // Haritanın DOM'da tamamen yüklendiğinden emin olmak için küçük bir gecikme eklenir, böylece harita düzgün şekilde initialize edilir ve marker'lar doğru konumlarda gösterilir
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Harita bileşeni yok edilirken haritayı temizlemek için, böylece bellek sızıntılarının önüne geçilir ve uygulamanın performansı korunur
    }
  }

  private loadLeaflet(): void {
    if (typeof window !== 'undefined' && !(window as any).L) { // Leaflet zaten yüklenmişse tekrar yüklenmez, böylece gereksiz ağ isteklerinin önüne geçilir ve uygulamanın performansı korunur
      const link = document.createElement('link'); 
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link); //

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

    const L = (window as any).L; // Leaflet global variable, böylece TypeScript derleyicisi L'nin var olduğunu bilir ve hata vermez

    this.map = L.map('map').setView([39.9334, 32.8597], 12);

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
    }, 100);
  }

  private updateMarkers(): void {
    if (!this.map) {
      console.log('Map not ready yet');
      return;
    }

    const L = (window as any).L;
    if (!L) return;

    this.markers.forEach((marker) => this.map.removeLayer(marker)); // Eski marker'lar haritadan kaldırılır, böylece yeni marker'lar eklenirken harita güncel kalır ve eski marker'ların gösterilmesi engellenir
    this.markers = [];

    const spots = this.filteredSpots();
    console.log('Updating markers for spots:', spots.length);

    spots.forEach((spot, index) => {
      const customIcon = L.divIcon({ // Her spot için özel bir divIcon oluşturulur, böylece marker'lar sırayla farklı renklerde gösterilir ve kullanıcıların harita üzerinde spot'ları kolayca ayırt etmeleri sağlanır
        className: 'leaflet-div-icon',
        html: `<div class="marker-pin">${index + 1}</div>`,
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
        });

      this.markers.push(marker);
    });

    if (spots.length > 0 && this.markers.length > 0) { // Eğer filtrelenmiş spot'lar varsa ve marker'lar oluşturulmuşsa, harita marker'ların bulunduğu bölgeye odaklanır, böylece kullanıcı filtreleri değiştirdiğinde veya harita yüklendiğinde harita her zaman güncel spot'ları gösterir ve kullanıcıların ilgilendikleri bölgeyi kolayca görmeleri sağlanır
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1)); // Harita, marker'ların bulunduğu bölgeye sığacak şekilde zoom ve konumlandırılır, böylece kullanıcı filtreleri değiştirdiğinde veya harita yüklendiğinde harita her zaman güncel spot'ları gösterir ve kullanıcıların ilgilendikleri bölgeyi kolayca görmeleri sağlanır
    }
  }

  setCategory(type: SpotType | null): void {
    this.selectedCategory.set(type);
  }

  onSearchChange(): void {
    // Effect handles update
  }

  selectSpot(spot: Spot): void {
    this.selectedSpot.set(spot);
    if (this.map) {
      this.map.setView([spot.latitude, spot.longitude], 15, { // Seçilen spot'un konumuna odaklanır, böylece kullanıcı listeye tıkladığında harita otomatik olarak o spot'un konumuna gider ve kullanıcıların ilgilendikleri bölgeyi kolayca görmeleri sağlanır
        animate: true,
        duration: 0.5,
      });
    }
  }

  selectSpotByClick(spot: Spot): void { // Marker'a tıklandığında spot seçilir, böylece kullanıcı harita üzerindeki marker'lara tıklayarak spot detaylarını görebilir ve etkileşimde bulunabilir
    this.selectedSpot.set(spot);
  }

  closeCard(): void { // Detay kartını kapatır, böylece kullanıcı detay kartını kapatmak istediğinde spot seçimi kaldırılır ve detay kartı gizlenir
    this.selectedSpot.set(null);
  }

  toggleSidebar(): void { // Kenar çubuğunu açıp kapatır, böylece kullanıcı kenar çubuğunu gizleyerek haritaya daha fazla alan açabilir veya kenar çubuğunu göstererek filtrelere ve spot listesine erişebilir
    this.sidebarCollapsed.update((val) => !val);
  }

  myLocation(): void {  // Kullanıcının konumunu gösterir, böylece kullanıcı konumunu paylaşmayı kabul ettiğinde harita otomatik olarak kullanıcının bulunduğu konuma gider ve kullanıcıların kendi konumlarını harita üzerinde görmeleri sağlanır
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
              <div class="user-pin">📍</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        this.userLocationMarker = L.marker([latitude, longitude], {
          icon: userIcon,
        })
          .addTo(this.map)
          .bindPopup('<strong>Konumunuz</strong>')
          .openPopup();

        this.map.setView([latitude, longitude], 15, {
          animate: true,
          duration: 1,
        });
      },
      (error) => {
        console.error('Could not get location.', error);
        alert(
          'Your location has not been granted access. Please allow location access to use this feature.',
        );
      },
    );
  }

  clearFilters(): void { // Arama sorgusunu ve seçilen kategoriyi sıfırlar, böylece kullanıcı filtreleri temizleyerek tüm spot'ları tekrar görebilir ve yeni bir arama yapabilir
    this.searchQuery = '';
    this.selectedCategory.set(null);
    this.selectedSpot.set(null);
  }

  getStars(rating: number): string { // Rating'e göre yıldız sayısı hesaplanır, örneğin 4.2 rating'i 4 yıldız olarak gösterilir, böylece kullanıcılar spot'un genel değerlendirmesini hızlıca görebilirler
    return '★'.repeat(Math.round(rating));
  }

  getSpotTypeEmoji(type: SpotType): string { // Spot type'a göre emoji döndürür, böylece kullanıcılar spot'ların türünü hızlıca görsel olarak ayırt edebilirler, eğer tanımlı bir emoji yoksa varsayılan olarak 📍 emojisi döndürülür
    const found = this.spotTypes.find((t) => t.type === type);
    return found?.emoji || '📍';
  }

  getSpotTypeLabel(type: SpotType): string { // Spot type'a göre label döndürür, böylece kullanıcılar spot'ların türünü hızlıca görebilirler, eğer tanımlı bir label yoksa varsayılan olarak 'Other' döndürülür
    const found = this.spotTypes.find((t) => t.type === type);
    return found?.label || 'Other';
  }
}
