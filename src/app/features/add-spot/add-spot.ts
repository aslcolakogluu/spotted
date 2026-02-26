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
import { SpotService } from '@core/services';
import { SpotType } from '@core/models';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

declare const L: any;

interface SpotForm {
  name: string;
  type: SpotType | null;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  bestTime: string;
}

interface ValidationErrors {
  name?: string;
  type?: string;
  address?: string;
  description?: string;
  location?: string;
}

@Component({
  selector: 'app-add-spot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-spot.html',
  styleUrl: './add-spot.css',
})
export class AddSpotComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private spotService = inject(SpotService);
  private authService = inject(AuthService);

  private map: any;
  private marker: any;

  // Form data
  formData = signal<SpotForm>({
    name: '',
    type: null,
    address: '',
    description: '',
    latitude: 39.9334,
    longitude: 32.8597,
    imageUrl: '',
    bestTime: '',
  });

  // Validation
  errors = signal<ValidationErrors>({});
  isSubmitting = signal(false);

  // Image upload
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  // Spot types
  readonly spotTypes = [
    { value: SpotType.NATURE, label: 'Nature', emoji: '' },
    { value: SpotType.PARK, label: 'Park', emoji: '' },
    { value: SpotType.BRIDGE, label: 'Bridge', emoji: '' },
    { value: SpotType.HISTORICAL, label: 'Historical', emoji: '' },
    { value: SpotType.MUSEUM, label: 'Museum', emoji: '' },
    { value: SpotType.BEACH, label: 'Beach', emoji: '' },
    { value: SpotType.SPORTS, label: 'Sports', emoji: '' },
    { value: SpotType.OTHER, label: 'Other', emoji: '' },
  ];

  // Computed preview data
  previewTitle = computed(() => {
    return this.formData().name || 'Spot Name';
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
    if (!type) return '-';
    const found = this.spotTypes.find((t) => t.value === type);
    return found ? `${found.emoji} ${found.label}` : '-';
  });

  previewTime = computed(() => {
    return this.formData().bestTime || '-';
  });

  ngOnInit(): void {
    // Giriş yapılmamışsa login'e yönlendir
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadLeaflet();
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

    this.map = L.map('location-map').setView([39.9334, 32.8597], 12);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      },
    ).addTo(this.map);

    // Map click event
    this.map.on('click', (e: any) => {
      this.onMapClick(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => this.map.invalidateSize(), 100);
  }

  onMapClick(lat: number, lng: number): void {
    const L = (window as any).L;

    // Update form data
    this.formData.update((data) => ({
      ...data,
      latitude: lat,
      longitude: lng,
    }));

    // Remove old marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add new marker
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="location-marker"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      this.selectedFile.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
  }

  validateForm(): boolean {
    const newErrors: ValidationErrors = {};
    const data = this.formData();

    if (!data.name.trim()) {
      newErrors.name = 'Spot name is required';
    }

    if (!data.type) {
      newErrors.type = 'Please select a category';
    }

    if (!data.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!data.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (data.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  onSubmit(): void {
    // Auth guard: kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting.set(true);

    // TODO: Upload image first if exists
    // TODO: Create spot via API

    // Mock submission
    setTimeout(() => {
      console.log('Spot data:', this.formData());
      console.log('Selected file:', this.selectedFile());

      alert('Spot successfully added!');
      this.router.navigate(['/explore']);
      this.isSubmitting.set(false);
    }, 1500);
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/']);
    }
  }

  updateField<K extends keyof SpotForm>(field: K, value: SpotForm[K]): void {
    this.formData.update((data) => ({
      ...data,
      [field]: value,
    }));
  }
}
