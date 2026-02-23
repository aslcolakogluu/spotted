import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpotService } from '@core/services';
import { Spot, SpotType, SortOption } from '@core/models';

const GRADS = [
  'linear-gradient(145deg, #1e3a3a 0%, #2a4a3a 40%, #1a2a2a 100%)',
  'linear-gradient(155deg, #2a2035 0%, #3a2a45 45%, #1a1525 100%)',
  'linear-gradient(140deg, #253545 0%, #1e2d3d 50%, #152535 100%)',
  'linear-gradient(160deg, #352520 0%, #453525 45%, #251a15 100%)',
  'linear-gradient(135deg, #2a3525 0%, #354530 50%, #1a2515 100%)',
  'linear-gradient(150deg, #253040 0%, #2a3848 50%, #152030 100%)'
];

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class ExploreComponent implements OnInit {
  private spotService = inject(SpotService); // SpotService'i inject ederek kullanıma hazır hale getirir
  private router = inject(Router);

  searchQuery = '';
  sortBy = signal<SortOption>(SortOption.RATING); // Varsayılan sıralama kriteri olarak "Rating" seçilir
  
  selectedCategory = signal<SpotType | null>(null); // Tüm kategoriler varsayılan olarak seçili
  filter5Star = true;
  filter4Star = true;
  filter3Star = false;
  
  currentPage = signal(1); // Sayfa numarası için signal oluşturulur
  itemsPerPage = 9; // Her sayfada gösterilecek öğe sayısı

  private allSpots = signal<Spot[]>([]); // Tüm spotları tutan signal, başlangıçta boş bir dizi ile başlatılır

  readonly spotTypes = [
    { type: SpotType.NATURE, label: 'Nature'},
    { type: SpotType.PARK, label: 'Park' },
    { type: SpotType.BRIDGE, label: 'Bridge'},
    { type: SpotType.HISTORICAL, label: 'Historical' },
    { type: SpotType.MUSEUM, label: 'Museum'},
    { type: SpotType.BEACH, label: 'Beach'},
    { type: SpotType.SPORTS, label: 'Sports' },
    { type: SpotType.OTHER, label: 'Other', emoji: '📍' }
  ];

  filteredSpots = computed(() => { // Filtrelenmiş spotları hesaplayan computed property
    let spots = this.allSpots(); // Tüm spotları alır

    const cat = this.selectedCategory(); // Seçilen kategoriye göre filtreleme yapılır
    if (cat) spots = spots.filter(s => s.type === cat); // Eğer bir kategori seçilmişse, sadece o kategoriye ait spotlar kalır

    const ratings: number[] = [];
    if (this.filter5Star) ratings.push(5);
    if (this.filter4Star) ratings.push(4);
    if (this.filter3Star) ratings.push(3);
    
    if (ratings.length > 0) { // Yıldız filtreleri uygulanır, seçilen yıldızlara göre spotlar filtrelenir
      spots = spots.filter(s => { // Her spot'un rating'i yuvarlanarak tam sayıya çevrilir ve seçilen yıldızlarla karşılaştırılır
        const r = Math.round(s.rating); // Örneğin, 4.2 rating'i 4 olarak değerlendirilir, böylece 4 yıldız filtrelemesi de dahil edilir
        return ratings.includes(r) ||  // 5 yıldız seçiliyse, 4.5 gibi yüksek rating'ler de dahil edilir
               (this.filter4Star && r >= 4) || // 4 yıldız seçiliyse, 3.5 gibi rating'ler de dahil edilir
               (this.filter3Star && r >= 3); // 3 yıldız seçiliyse, 2.5 gibi rating'ler de dahil edilir
      });
    }

    const query = this.searchQuery.trim().toLowerCase(); // Arama sorgusu boşluklardan temizlenir ve küçük harfe çevrilir, böylece arama büyük/küçük harf duyarsız olur
    if (query) {
      spots = spots.filter(s =>
        s.name.toLowerCase().includes(query) || // Spot'un adı arama sorgusunu içeriyor mu kontrol edilir
        s.address.toLowerCase().includes(query) || // Spot'un adresi arama sorgusunu içeriyor mu kontrol edilir
        s.description.toLowerCase().includes(query) // Spot'un açıklaması arama sorgusunu içeriyor mu kontrol edilir, böylece kullanıcılar sadece isim ve adresle değil, açıklama ile de arama yapabilirler
      );
    }

    return this.sortSpots(spots);
  });

  topRankings = computed(() => { // En iyi 5 spot'u hesaplayan computed property
    return [...this.allSpots()] // Tüm spotları kopyalayarak yeni bir dizi oluşturulur, böylece orijinal dizi değiştirilmez
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)) // Spot'lar rating ve review count'un çarpımına göre sıralanır, böylece yüksek rating'e sahip ve çok sayıda yorum alan spot'lar üst sıralarda yer alır
      .slice(0, 5); // Sadece ilk 5 spot alınır, böylece en iyi 5 spot listelenir
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredSpots().length / this.itemsPerPage) // Toplam sayfa sayısı, filtrelenmiş spot sayısının her sayfada gösterilecek öğe sayısına bölünmesiyle hesaplanır ve yukarı yuvarlanır, böylece eksik sayfa da tam sayıya tamamlanır
  );

  paginatedSpots = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage; // Başlangıç index'i, mevcut sayfa numarası ve her sayfada gösterilecek öğe sayısına göre hesaplanır
    return this.filteredSpots().slice(start, start + this.itemsPerPage); // Filtrelenmiş spot'lar, başlangıç index'inden başlayarak her sayfada gösterilecek öğe sayısı kadar alınır, böylece sadece o sayfaya ait spot'lar gösterilir
  });

  visiblePages = computed(() => {
    const total = this.totalPages(); 
    const current = this.currentPage(); 
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i); // Toplam sayfa 7 veya daha az ise, tüm sayfalar gösterilir
    } else {
      pages.push(1); // İlk sayfa her zaman gösterilir
      if (current > 3) pages.push(-1); // Eğer mevcut sayfa 3'ten büyükse, ilk sayfa ile mevcut sayfa arasında boşluk olduğunu göstermek için -1 eklenir (bu, UI'da "..." olarak gösterilebilir)
      
      const start = Math.max(2, current - 1); // Başlangıç sayfası, mevcut sayfanın bir öncesi olarak belirlenir, ancak 2'den küçük olamaz çünkü 1 zaten gösteriliyor
      const end = Math.min(total - 1, current + 1); // Bitiş sayfası, mevcut sayfanın bir sonrası olarak belirlenir, ancak toplam sayfadan 1 eksik olamaz çünkü son sayfa zaten gösteriliyor
      for (let i = start; i <= end; i++) pages.push(i); // Mevcut sayfanın bir öncesi, kendisi ve bir sonrası sayfalar gösterilir, böylece kullanıcı mevcut sayfanın konumunu kolayca görebilir
      
      if (current < total - 2) pages.push(-1); // Eğer mevcut sayfa toplam sayfadan 2 eksikse, mevcut sayfa ile son sayfa arasında boşluk olduğunu göstermek için -1 eklenir (bu, UI'da "..." olarak gösterilebilir)
      pages.push(total);
    }
    
    return pages;
  });

  ngOnInit(): void { 
    this.spotService.getSpots().subscribe(spots => { // SpotService'den spot'lar alınır ve allSpots signal'ına atanır, böylece uygulama genelinde bu spot'lara erişilebilir ve reaktif olarak güncellenebilir
      this.allSpots.set(spots);
    });
  }

  setCategory(type: SpotType | null): void { // Kategori seçimi yapıldığında, selectedCategory signal'ı güncellenir ve sayfa numarası 1'e resetlenir, böylece kullanıcı yeni kategoriye ait spot'ları ilk sayfadan görmeye başlar
    this.selectedCategory.set(type); // Eğer aynı kategori tekrar seçilirse, kategoriyi kaldırmak için null olarak set edilir
    this.currentPage.set(1); // Kategori değiştiğinde sayfa numarası 1'e resetlenir, böylece kullanıcı yeni kategoriye ait spot'ları ilk sayfadan görmeye başlar
  }

  onSearchChange(): void { // Arama sorgusu değiştiğinde, sayfa numarası 1'e resetlenir, böylece kullanıcı arama sonuçlarını ilk sayfadan görmeye başlar
    this.currentPage.set(1);
  }

  onSortChange(): void { // Sıralama kriteri değiştiğinde, sayfa numarası 1'e resetlenir, böylece kullanıcı sıralanmış spot'ları ilk sayfadan görmeye başlar
    this.currentPage.set(1);
  }

  applyFilters(): void { // Filtreler uygulandığında, sayfa numarası 1'e resetlenir, böylece kullanıcı filtrelenmiş spot'ları ilk sayfadan görmeye başlar
    this.currentPage.set(1);
  }

  sortSpots(spots: Spot[]): Spot[] { // Spot'ları seçilen sıralama kriterine göre sıralayan yardımcı fonksiyon
    const sortOption = this.sortBy(); // Sıralama kriteri alınır
     
    switch (sortOption) {
      case SortOption.RATING: // Rating'e göre sıralama yapılır, yüksek rating'li spot'lar üst sıralarda yer alır
        return [...spots].sort((a, b) => b.rating - a.rating); // Sıralama yapılırken orijinal dizi değiştirilmemesi için yeni bir dizi oluşturulur
      case SortOption.MOST_REVIEWED: // Yorum sayısına göre sıralama yapılır, çok sayıda yorum alan spot'lar üst sıralarda yer alır
        return [...spots].sort((a, b) => b.reviewCount - a.reviewCount); // Sıralama yapılırken orijinal dizi değiştirilmemesi için yeni bir dizi oluşturulur
      case SortOption.NEWEST: // Yeni eklenen spot'lara göre sıralama yapılır, en yeni spot'lar üst sıralarda yer alır
        return [...spots].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sıralama yapılırken orijinal dizi değiştirilmemesi için yeni bir dizi oluşturulur
      default:
        return spots;
    }
  }

  goToPage(page: number): void { // Belirli bir sayfaya gitmek için kullanılan fonksiyon, geçersiz sayfa numaraları kontrol edilir ve geçerli bir sayfa numarası verilirse currentPage signal'ı güncellenir, böylece kullanıcı seçilen sayfanın spot'larını görmeye başlar
    if (page === -1) return; // Eğer page -1 ise, bu bir boşluk göstermek için kullanılır (UI'da "..." olarak gösterilebilir) ve sayfa değişikliği yapılmaz
    this.currentPage.set(page); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfa değiştiğinde kullanıcıyı sayfanın en üstüne kaydırır, böylece yeni sayfanın içeriği hemen görünür olur
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1); // Mevcut sayfa numarası 1'den büyükse, bir önceki sayfaya geçilir
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1); // Mevcut sayfa numarası toplam sayfa sayısından küçükse, bir sonraki sayfaya geçilir
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getGradient(index: number): string { // Spot'lara sırayla farklı arka plan renkleri vermek için kullanılan fonksiyon, index'e göre GRADS dizisinden bir gradient seçilir ve döndürülür, böylece her spot'un arka planı farklı bir renkte olur
    return GRADS[index % GRADS.length]; // Index, GRADS dizisinin uzunluğuna göre mod alınarak döngüsel olarak gradient'ler kullanılır, böylece kaç spot olursa olsun renkler sırayla atanır
  } 

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating)); // Rating'e göre yıldız sayısı hesaplanır, örneğin 4.2 rating'i 4 yıldız olarak gösterilir, böylece kullanıcılar spot'un genel değerlendirmesini hızlıca görebilirler
  }

  // ✅ YENİ: Spot type'a göre emoji
  getSpotTypeEmoji(type: SpotType): string {
    const found = this.spotTypes.find(t => t.type === type);
    return found?.emoji || '📍';
  }

  // ✅ YENİ: Spot type'a göre label
  getSpotTypeLabel(type: SpotType): string {
    const found = this.spotTypes.find(t => t.type === type);
    return found?.label || 'Diğer';
  }
}