// Add-spot (mekan ekleme) bileşeni — kullanıcıların yeni mekan eklemesini sağlayan çok adımlı form
// Adım 1: Haritadan konum seçimi, Adım 2: Açıklama ve kategori, Adım 3: Adres ve medya
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpotService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { SpotType } from '@core/models';
import { SPOT_TYPES, getSpotTypeIcon, getSpotTypeLabel } from '@shared/constants/spot-type-icons';

// Leaflet harita kütüphanesi global scope'tan erişilir (CDN ile yüklenir)
declare const L: any;

// Form verilerini tutan arayüz — her adımdaki alanları içerir
interface SpotForm {
  name: string;
  type: SpotType | null;
  address: string;
  description: string;
  latitude: number;    // Haritadan seçilen enlem koordinatı
  longitude: number;   // Haritadan seçilen boylam koordinatı
  bestTime: string;    // En iyi ziyaret saati (opsiyonel bilgi)
}

// Form validasyon hatalarını tutan arayüz — her alan için hata mesajı
interface ValidationErrors {
  name?: string;
  type?: string;
  address?: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  bestTime?: string;
}

@Component({
  selector: 'app-add-spot',
  standalone: true,
  imports: [FormsModule, CommonModule], // CommonModule: *ngIf, *ngFor direktifleri için
  templateUrl: './add-spot.html',
  styleUrl: './add-spot.css',
})
// OnInit: giriş kontrolü ve Leaflet yükleme, AfterViewInit: haritayı DOM'a ekle, OnDestroy: harita temizleme
export class AddSpotComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private spotService = inject(SpotService);
  private authService = inject(AuthService);

  private map: any;     // Leaflet harita nesnesi referansı
  private marker: any;  // Haritadaki konum markeri referansı

  currentStep = signal<number>(1); // Aktif adım (1, 2 veya 3)
  readonly totalSteps = 3;          // Toplam adım sayısı

  // Form alanlarının reaktif durumu — her adım bu veriden okunur/yazar
  formData = signal<SpotForm>({
    name: '',
    type: null,
    address: '',
    description: '',
    latitude: 39.9334,  // Ankara'nın varsayılan enlemi
    longitude: 32.8597, // Ankara'nın varsayılan boylamı
    bestTime: '',
  });

  // Validasyon hataları ve gönderim durumu
  errors = signal<ValidationErrors>({});
  isSubmitting = signal(false); // Submit butonu tıklandığında çift gönderimi engeller

  // Resim yükleme durumu
  selectedFile = signal<File | null>(null);    // Seçilen dosya nesnesi
  imagePreview = signal<string | null>(null);  // Base64 önizleme URL'i

  // Mekan türlerinin listesi (kategori seçim butonları için)
  readonly spotTypes = SPOT_TYPES;

  // Önizleme alanı için computed değerler — formData değiştikçe otomatik güncellenir
  previewTitle = computed(() => {
    return this.formData().name || 'Spot Name'; // Ad girilmemişse placeholder göster
  });

  previewAddress = computed(() => {
    return this.formData().address || 'Address information';
  });

  previewDescription = computed(() => {
    return (
      this.formData().description ||
      'Description will appear here. Please provide a detailed description of the spot, including what makes it special and any tips for visitors.'
    );
  });

  previewCategory = computed(() => {
    const type = this.formData().type;
    if (!type) return '-'; // Kategori seçilmemişse tire göster
    return getSpotTypeLabel(type);
  });

  previewTime = computed(() => {
    return this.formData().bestTime || '-';
  });

  // Belirli bir adıma gider ve adım 1 ise haritayı yeniden başlatır
  goToStep(step: number): void {
    this.currentStep.set(step);
    if (step === 1) {
      setTimeout(() => this.reinitializeMap(), 100); // DOM güncellemesinden sonra haritayı düzelt
    }
  }

  // Bileşen başlatıldığında: kimlik doğrulama kontrolü ve Leaflet yükleme
  ngOnInit(): void {
    // Giriş yapılmamışsa login'e yönlendir — authGuard'a ek güvenlik katmanı
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadLeaflet(); // Leaflet CSS ve JS'ini DOM'a ekle
  }

  // DOM hazır olduktan sonra haritayı başlat (100ms gecikme ile)
  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  // Bileşen yok edilirken harita kaynakları serbest bırakılır
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // Leaflet kütüphanesini CDN üzerinden dinamik olarak yükler
  // window.L henüz yoksa script ve CSS link elemanları oluşturulup DOM'a eklenir
  private loadLeaflet(): void {
    if (typeof window !== 'undefined' && !(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setTimeout(() => this.initMap(), 100); // JS yüklendikten sonra haritayı başlat
      };
      document.body.appendChild(script);
    }
  }

  // Leaflet haritasını 'location-map' elementine bağlar ve tıklama eventini tanımlar
  private initMap(): void {
    if (typeof window === 'undefined' || !(window as any).L || this.map) return;

    const L = (window as any).L;

    // Haritayı Ankara merkezli başlat (zoom: 12)
    this.map = L.map('location-map').setView([39.9334, 32.8597], 12);

    // CARTO dark tema harita katmanı ekle
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      },
    ).addTo(this.map);

    // Haritaya tıklandığında koordinatları form verilerine kaydet
    this.map.on('click', (e: any) => {
      this.onMapClick(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => this.map.invalidateSize(), 100); // Boyut hesaplama tutarsızlığını düzelt
  }

  // Tab değişiminde haritanın boyutunu yeniden hesaplar (CSS gizli iken boyut 0 olabilir)
  private reinitializeMap(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 100);
    }
  }

  // Haritaya tıklandığında seçilen koordinatları form verilerine kaydeder ve marker yerleştirir
  onMapClick(lat: number, lng: number): void {
    const L = (window as any).L;

    // Koordinatları formData sinyaline immutable olarak güncelle
    this.formData.update((data: SpotForm) => ({
      ...data,
      latitude: lat,
      longitude: lng,
    }));

    // Önceki markeri kaldır
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Özel styled marker ekle (CSS ile şekillendirilmiş)
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="location-marker"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
  }

  // Dosya seçildiğinde boyut ve tür validasyonu yapılır, önizleme oluşturulur
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Dosya boyutu kontrolü (maksimum 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      // Dosya türü kontrolü — sadece görsel dosyalar kabul edilir
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      this.selectedFile.set(file);

      // FileReader ile görseli Base64'e çevir ve önizleme oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Seçilen görsel önizlemesini kaldırır
  removeImage(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
  }

  // Adım 1 validasyonu: mekan adı ve konum zorunludur
  validateStep1(): boolean {
    const newErrors: ValidationErrors = {};
    const data = this.formData();

    if (!data.name.trim()) {
      newErrors.name = 'Spot name is required';
    }

    if (!data.latitude || !data.longitude) {
      newErrors.location = 'Please select a location on the map';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0; // Hata yoksa true döner
  }

  // Adım 2 validasyonu: kategori seçimi ve en az 50 karakterlik açıklama zorunludur
  validateStep2(): boolean {
    const newErrors: ValidationErrors = {};
    const data = this.formData();

    if (!data.type || data.type === ('null' as any)) {
      newErrors.type = 'Please select a category';
    }

    if (!data.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (data.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Adım 3 validasyonu: adres zorunludur, görsel ve saat opsiyoneldir
  validateStep3(): boolean {
    const newErrors: ValidationErrors = {};
    const data = this.formData();

    if (!data.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Image and bestTime are optional

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Tüm adımları sırayla valide eder — ilk hatalı adıma otomatik gider
  validateForm(): boolean {
    const step1Valid = this.validateStep1();
    const step2Valid = this.validateStep2();
    const step3Valid = this.validateStep3();

    // Navigate to the first failing step so the user can see errors
    if (!step1Valid) {
      this.goToStep(1);
      return false;
    }
    if (!step2Valid) {
      this.goToStep(2);
      return false;
    }
    if (!step3Valid) {
      this.goToStep(3);
      return false;
    }

    return true;
  }

  // İleri butonuna tıklandığında: aktif adımı valide edip bir sonraki adıma geçer
  nextStep(): void {
    if (this.currentStep() === 1 && !this.validateStep1()) {
      return; // Validasyon başarısız — adımda kal
    }
    if (this.currentStep() === 2 && !this.validateStep2()) {
      return;
    }
    if (this.currentStep() === 3 && !this.validateStep3()) {
      return;
    }

    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((n: number) => n + 1); // Adımı artır
    }
  }

  // Geri butonuna tıklandığında bir önceki adıma döner (minimum adım 1)
  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((n: number) => n - 1);
    }
  }

  // Form gönderildiğinde: son validasyon, kimlik kontrolü ve SpotService.createSpot() çağrısı
  onSubmit(): void {
    // Auth guard: kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.validateForm()) {
      return; // Validasyon başarısız — submit yapma
    }

    this.isSubmitting.set(true); // Submit butonunu devre dışı bırak

    // Giriş yapmış kullanıcıyı al — null ise işlemi durdur
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Please login first.');
      this.router.navigate(['/login']);
      return;
    }

    const data = this.formData();

    // SpotService.createSpot() ile localStorage'a yeni mekan ekler ve günceller
    this.spotService
      .createSpot({
        name: data.name,
        type: data.type!,
        address: data.address,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        // Görsel seçilmemişse Unsplash'tan varsayılan fotoğraf kullanılır
        imageUrl:
          this.imagePreview() ||
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      })
      .subscribe({
        next: (spot: any) => {
          console.log('Spot added:', spot);
          alert('Spot successfully added!');
          this.router.navigate(['/explore']); // Başarıyla eklenince explore sayfasına git
        },
        error: (error: any) => {
          console.error('Error adding spot:', error);
          alert('An error occurred while adding the spot.');
          this.isSubmitting.set(false); // Hata durumunda butonu tekrar aktif et
        },
      });
  }

  // İptal butonuna tıklandığında onay isteyip ana sayfaya döner
  onCancel(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/']);
    }
  }

  // Generic form alanı güncelleyicisi — TypeScript generic tipi ile tip güvenliği sağlar
  // Örnek kullanım: updateField('name', 'Yeni mekan adı')
  updateField<K extends keyof SpotForm>(field: K, value: SpotForm[K]): void {
    this.formData.update((data: SpotForm) => ({
      ...data,
      [field]: value, // Computed property ile dinamik alan güncelleme
    }));
  }
}
