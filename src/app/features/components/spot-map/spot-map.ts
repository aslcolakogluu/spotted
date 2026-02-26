import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  signal,
  input,
  output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

export interface MapSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  rating: number;
  bestHour?: string;
}

@Component({
  selector: 'app-spot-map',
  standalone: true,
  imports: [],
  templateUrl: './spot-map.html',
  styleUrl: './spot-map.css',
})
export class SpotMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapEl!: ElementRef; // Harita konteyneri referansı

  /** Dışarıdan spot verileri alınabilir */
  spots = input<MapSpot[]>([]);

  /** Bir pin'e tıklandığında dışarı bildirilir */
  spotSelected = output<MapSpot>();

  /** Aktif (seçili) spot */
  activeSpot = signal<MapSpot | null>(null); // null olabilir çünkü başlangıçta hiçbir spot seçili değil

  private map!: L.Map;
  private markers: L.Marker[] = []; // Haritadaki marker'lar (güncellemeler için referans)

  private readonly defaultSpots: MapSpot[] = [
    {
      id: '1',
      name: 'City Bridge',
      lat: 39.9255,
      lng: 32.854,
      type: 'bridge',
      rating: 4.9,
      bestHour: 'Evening 18–20',
    },
    {
      id: '2',
      name: 'Tree Park',
      lat: 39.9455,
      lng: 32.825,
      type: ' Park',
      rating: 4.3,
      bestHour: 'Morning 7-9',
    },
    {
      id: '3',
      name: 'Historical Square',
      lat: 39.91,
      lng: 32.865,
      type: 'historical',
      rating: 4.8,
      bestHour: 'Evening 18–20',
    },
    {
      id: '4',
      name: 'Art Gallery',
      lat: 39.935,
      lng: 32.845,
      type: 'museum',
      rating: 4.1,
      bestHour: 'Afternoon 12–14',
    },
    {
      id: '5',
      name: 'Park with Green Trees',
      lat: 39.9405,
      lng: 32.8635,
      type: ' Nature',
      rating: 4.7,
      bestHour: 'Morning 8–10',
    },
    {
      id: '6',
      name: 'Beach with Sunset View',
      lat: 39.9,
      lng: 32.86,
      type: 'beach',
      rating: 4.5,
      bestHour: 'Evening 17–19',
    },
  ];

  ngOnInit(): void {} //void olarak bırakıldı, çünkü ngOnInit'te henüz harita başlatılmıyor. Harita ve marker'lar ngAfterViewInit'te başlatılıyor.

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      // Haritayı oluştururken başlangıç konumu ve zoom seviyesi belirlenir
      center: [39.925, 32.855], // Ankara merkez
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark-themed tile katmanı (CartoDB Dark Matter)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      },
    ).addTo(this.map);
  }

  private addMarkers(): void {
    const spotsToRender =
      this.spots().length > 0 ? this.spots() : this.defaultSpots;

    // Başlangıçta hiçbir spot aktif değil - hepsi sarı
    // activeSpot null olarak başlar

    spotsToRender.forEach((spot, index) => {
      const isActive = false; // Başlangıçta hepsi sarı
      const icon = this.createCustomIcon(index + 1, isActive);
      const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(this.map);

      // Popup
      marker.bindPopup(
        `<div style="text-align:center;">
          <strong style="font-size:0.9rem;">${spot.name}</strong><br/>
          <span style="color:rgba(238,232,223,0.5); font-size:0.75rem;">
            ${spot.type} · ★ ${spot.rating}
          </span>
          ${spot.bestHour ? `<br/><span style="color:#6fbf82; font-size:0.72rem;"> ${spot.bestHour}</span>` : ''}
        </div>`,
        { className: 'dark-popup' },
      );

      // Tıklama → aktif spot değiştir
      marker.on('click', () => {
        this.setActiveSpot(spot, index);
      });

      this.markers.push(marker);
    });
  }

  /** Tüm marker ikonlarını günceller ve aktif spot'u set eder */
  private setActiveSpot(spot: MapSpot, activeIndex: number): void {
    this.activeSpot.set(spot);
    this.spotSelected.emit(spot);

    // İkonları güncelle
    const spotsToRender =
      this.spots().length > 0 ? this.spots() : this.defaultSpots;

    this.markers.forEach((marker, i) => {
      const isActive = i === activeIndex;
      marker.setIcon(this.createCustomIcon(i + 1, isActive));
    });
  }

  /** Mockup'taki pin stiline uygun özel Leaflet ikonu */
  private createCustomIcon(number: number, isActive: boolean): L.DivIcon {
    const bg = isActive ? '#6fbf82' : '#c8a96e';
    const shadow = isActive
      ? 'rgba(111,191,130,0.45)'
      : 'rgba(200,169,110,0.4)';
    const pulseColor = isActive
      ? 'rgba(111,191,130,0.3)'
      : 'rgba(200,169,110,0.3)';

    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid ${pulseColor};
            animation: pinPulse 2s infinite;
          "></div>
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${bg};
            border: 3px solid #0a0b0d;
            box-shadow: 0 2px 10px ${shadow};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            font-weight: 700;
            color: #0a0b0d;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          ">${number}</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }

  /** Programatik olarak haritayı bir spot'a odaklar */
  flyToSpot(spot: MapSpot): void {
    // Dışarıdan bir spot seçildiğinde haritayı o noktaya odaklar
    this.map.flyTo([spot.lat, spot.lng], 15, { duration: 0.8 });
    const idx = (
      this.spots().length > 0 ? this.spots() : this.defaultSpots
    ).findIndex((s) => s.id === spot.id);
    if (idx !== -1) {
      this.setActiveSpot(spot, idx);
      this.markers[idx].openPopup();
    }
  }

  /** Haritayı tüm spotları gösterecek şekilde yeniden boyutlandırır */
  fitAllSpots(): void {
    if (this.markers.length > 0) {
      // Eğer marker'lar varsa, haritayı tüm marker'ları gösterecek şekilde ayarlar
      const group = L.featureGroup(this.markers); // Marker'ları bir feature group olarak gruplar, böylece tüm marker'ların kapsandığı sınırları kolayca alabiliriz
      this.map.fitBounds(group.getBounds().pad(0.15)); // Harita sınırlarını marker'ların etrafında biraz boşluk bırakarak ayarlar
    }
  }
}
