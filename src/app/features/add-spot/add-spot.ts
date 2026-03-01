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

declare const L: any;

interface SpotForm {
  name: string;
  type: SpotType | null;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  bestTime: string;
}

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

  currentStep = signal<number>(1);
  readonly totalSteps = 3;

  // Form data
  formData = signal<SpotForm>({
    name: '',
    type: null,
    address: '',
    description: '',
    latitude: 39.9334,
    longitude: 32.8597,
    bestTime: '',
  });

  // Validation
  errors = signal<ValidationErrors>({});
  isSubmitting = signal(false);

  // Image upload
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  // Spot types
  readonly spotTypes = SPOT_TYPES;

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
    return getSpotTypeLabel(type);
  });

  previewTime = computed(() => {
    return this.formData().bestTime || '-';
  });



  goToStep(step: number): void {
    this.currentStep.set(step);
    if (step === 1) {
      setTimeout(() => this.reinitializeMap(), 100);
    }
  }

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

  private reinitializeMap(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 100);
    }
  }

  onMapClick(lat: number, lng: number): void {
    const L = (window as any).L;

    // Update form data
    this.formData.update((data: SpotForm) => ({
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
    return Object.keys(newErrors).length === 0;
  }

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

  nextStep(): void {
    if (this.currentStep() === 1 && !this.validateStep1()) {
      return;
    }
    if (this.currentStep() === 2 && !this.validateStep2()) {
      return;
    }
    if (this.currentStep() === 3 && !this.validateStep3()) {
      return;
    }

    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((n: number) => n + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((n: number) => n - 1);
    }
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

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Please login first.');
      this.router.navigate(['/login']);
      return;
    }

    const data = this.formData();

    this.spotService
      .createSpot({
        name: data.name,
        type: data.type!,
        address: data.address,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl:
          this.imagePreview() ||
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      })
      .subscribe({
        next: (spot: any) => {
          console.log('Spot added:', spot);
          alert('Spot successfully added!');
          this.router.navigate(['/explore']);
        },
        error: (error: any) => {
          console.error('Error adding spot:', error);
          alert('An error occurred while adding the spot.');
          this.isSubmitting.set(false);
        },
      });
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/']);
    }
  }

  updateField<K extends keyof SpotForm>(field: K, value: SpotForm[K]): void {
    this.formData.update((data: SpotForm) => ({
      ...data,
      [field]: value,
    }));
  }
}
