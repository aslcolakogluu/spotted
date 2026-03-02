// Keşfet (explore) bileşeni — kullanıcıların mekanları listelediği, filtrelediği ve aradığı ana sayfa
// BehaviorSubject'e subscribe olarak yeni eklenen mekanlar otomatik olarak görüntülenir
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotService } from '@core/services';
import { Spot, SpotType, SortOption } from '@core/models';
import { SPOT_TYPES, getSpotTypeIcon, getSpotTypeLabel as getLabel } from '@shared/constants/spot-type-icons';

// Kart arka planları için kullanılan gradyan renk paleti
// Her kartta index % GRADS.length ile dönüşümlü olarak uygulanır
const GRADS = [
  'linear-gradient(145deg, #1e3a3a 0%, #2a4a3a 40%, #1a2a2a 100%)',
  'linear-gradient(155deg, #2a2035 0%, #3a2a45 45%, #1a1525 100%)',
  'linear-gradient(140deg, #253545 0%, #1e2d3d 50%, #152535 100%)',
  'linear-gradient(160deg, #352520 0%, #453525 45%, #251a15 100%)',
  'linear-gradient(135deg, #2a3525 0%, #354530 50%, #1a2515 100%)',
  'linear-gradient(150deg, #253040 0%, #2a3848 50%, #152030 100%)',
];

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule], // FormsModule: arama inputu için ngModel bağlaması
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class ExploreComponent implements OnInit, OnDestroy {
  private spotService = inject(SpotService); // SpotService: mekan verilerini çeken servis

  searchQuery = '';                                         // Arama kutusundaki anlık metin
  activeSearchQuery = signal('');                           // Enter'a basılınca aktif hale gelen arama sorgusu
  sortBy = signal<SortOption>(SortOption.RATING);           // Seçili sıralama seçeneği (varsayılan: puan)

  selectedCategory = signal<SpotType | null>(null); // Seçili kategori filtresi (null = tümü)
  // Yıldız filtre seçenekleri — checkbox durumları
  filter5Star = true;
  filter4Star = true;
  filter3Star = false;

  currentPage = signal(1);  // Aktif sayfa numarası
  itemsPerPage = 9;         // Sayfada gösterilen maksimum kart sayısı

  private allSpots = signal<Spot[]>([]);  // Servisten gelen tüm mekanların listesi

  readonly spotTypes = SPOT_TYPES; // HTML template'de kategori butonlarını oluşturmak için

  // Kategori, puan ve arama filtrelerine göre filtrelenmiş mekan listesi
  // Computed getter: bağımlı sinyaller değiştiğinde Angular tarafından otomatik yeniden hesaplanır
  get filteredSpots(): Spot[] {
    let spots = this.allSpots();

    // Kategori filtresi — seçili kategori varsa sadece o kategorideki mekanlar gösterilir
    const cat = this.selectedCategory();
    if (cat) spots = spots.filter((s) => s.type === cat);

    // Puan filtresi — seçili yıldız aralıklarına göre filtreleme
    spots = spots.filter((s) => {
      const rating = Math.round(s.rating);

      // Henüz değerlendirilmemiş spotları her zaman göster
      if (rating === 0) return true;

      // Hiçbir filtre seçili değilse hepsini göster
      if (!this.filter5Star && !this.filter4Star && !this.filter3Star) {
        return true;
      }

      // 5★ seçili ve rating 5 ise göster
      if (this.filter5Star && rating === 5) return true;

      // 4★ seçili ve rating 4 ise göster
      if (this.filter4Star && rating === 4) return true;

      // 3★ seçili ve rating 3 veya altı ise göster
      if (this.filter3Star && rating <= 3) return true;

      return false;
    });

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

    return this.sortSpots(spots); // Sıralama uygulanarak sonuç döndürülür
  }

  // Sidebar'da gösterilecek en iyi 5 mekan — puan × yorum sayısı ağırlıklı skorlamayla
  get topRankings(): Spot[] {
    return [...this.allSpots()]
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, 5);
  }

  // Sayfalama için toplam sayfa sayısı
  get totalPages(): number {
    return Math.ceil(this.filteredSpots.length / this.itemsPerPage);
  }

  // Aktif sayfadaki mekanlar — sayfalama offset'i hesaplanarak slice edilir
  get paginatedSpots(): Spot[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredSpots.slice(start, start + this.itemsPerPage);
  }

  // Sayfalama butonları için görünür sayfa numaraları
  // 7'den fazla sayfa varsa akıllı elipsis (...) mantığı uygulanır
  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i); // Az sayfa varsa hepsini göster
    } else {
      pages.push(1); // Her zaman ilk sayfa gösterilir
      if (current > 3) pages.push(-1); // Elipsis: başta boşluk varsa

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i); // Aktif sayfanın çevresi

      if (current < total - 2) pages.push(-1); // Elipsis: sonda boşluk varsa
      pages.push(total); // Her zaman son sayfa gösterilir
    }

    return pages;
  }

  private spotsSubscription: any; // Aboneliği ngOnDestroy'da temizlemek için tutuluyor

  // Bileşen yüklendiğinde SpotService'e abone olunur
  // BehaviorSubject sayesinde yeni spot eklenince liste otomatik güncellenir
  ngOnInit(): void {
    this.spotsSubscription = this.spotService.getSpots().subscribe((spots) => {
      this.allSpots.set(spots);
    });
  }

  // Bileşen yok edildiğinde bellek sızıntısını önlemek için abonelik sonlandırılır
  ngOnDestroy(): void {
    this.spotsSubscription?.unsubscribe();
  }

  // Seçili kategoriyi günceller ve sayfa numarasını 1'e sıfırlar
  setCategory(type: SpotType | null): void {
    this.selectedCategory.set(type);
    this.currentPage.set(1);
  }

  // Kullanıcı arama butonuna bastığında veya Enter'a bastığında çalışır
  onSearchSubmit(): void {
    console.log('Search submitted:', this.searchQuery);
    this.activeSearchQuery.set(this.searchQuery); // Aktif sorguyu güncelle
    this.currentPage.set(1); // Aramada her zaman ilk sayfaya dön
  }

  // Sıralama değiştiğinde sayfayı sıfırlar
  onSortChange(): void {
    this.currentPage.set(1);
  }

  // Filtreler değiştiğinde sayfayı sıfırlar
  applyFilters(): void {
    this.currentPage.set(1);
  }

  // Seçili sıralama seçeneğine göre mekan listesini sıralar
  sortSpots(spots: Spot[]): Spot[] {
    const sortOption = this.sortBy();

    switch (sortOption) {
      case SortOption.RATING:
        return [...spots].sort((a, b) => b.rating - a.rating); // Yüksek puandan düşüğe
      case SortOption.MOST_REVIEWED:
        return [...spots].sort((a, b) => b.reviewCount - a.reviewCount); // Çok yorumlandan aza
      case SortOption.NEWEST:
        return [...spots].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(), // En yeni eklenenden eskiye
        );
      default:
        return spots;
    }
  }

  // Belirli sayfaya gitmek için — -1 elipsis değerini engeller, smooth scroll uygular
  goToPage(page: number): void {
    if (page === -1) return; // Elipsis tıklandığında hiçbir şey yapma
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfa başına scroll
  }

  // Önceki sayfaya git (minimum 1)
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Sonraki sayfaya git (maksimum totalPages)
  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Mekan kartının arka plan gradyanını döndürür — index ile döngüsel seçim yapılır
  getGradient(index: number): string {
    return GRADS[index % GRADS.length];
  }

  // Puan değerini dolu yıldızlara dönüştürür (örn: 4.2 → "★★★★")
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

  // Arama sorgusunu temizler ve filtreyi sıfırlar
  clearSearch(): void {
    this.searchQuery = '';
    this.activeSearchQuery.set('');
    this.currentPage.set(1);
  }
}
