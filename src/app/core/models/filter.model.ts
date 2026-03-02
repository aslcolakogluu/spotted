// Filtreleme ile ilgili tüm veri tipleri bu dosyada tanımlanmıştır
import { SpotType } from './spot.model';

// Explore ve harita sayfalarında kullanılan filtre seçenekleri arayüzü
export interface FilterOptions {
  types: SpotType[];          // Seçili mekan kategorileri (birden fazla seçilebilir)
  priceRange?: PriceRange;    // Opsiyonel: fiyat aralığı filtresi
  rating?: number;            // Opsiyonel: minimum puan filtresi
  distance?: number;          // Opsiyonel: maksimum mesafe (km)
  tags?: string[];            // Opsiyonel: etiket filtresi
  isVerified?: boolean;       // Opsiyonel: sadece doğrulanmış mekanları göster
  isOpen?: boolean;           // Opsiyonel: sadece şu an açık mekanları göster
  sortBy?: SortOption;        // Sıralama seçeneği
}

// Fiyat aralığını tanımlayan enum
export enum PriceRange {
  BUDGET = 'budget',       // Uygun fiyatlı
  MODERATE = 'moderate',   // Orta fiyatlı
  EXPENSIVE = 'expensive', // Pahalı
  LUXURY = 'luxury'        // Lüks
}

// Listeleme sıralama seçenekleri
export enum SortOption {
  RELEVANCE = 'relevance',         // İlgililik sırasına göre
  RATING = 'rating',               // Puana göre (yüksekten düşüğe)
  DISTANCE = 'distance',           // Mesafeye göre (yakından uzağa)
  NEWEST = 'newest',               // Eklenme tarihine göre (en yeni önce)
  MOST_REVIEWED = 'most_reviewed'  // Yorum sayısına göre (en çok yorumlanan önce)
}

// UI'da aktif filtreyi temsil eden chip (etiket) nesnesi
// Kullanıcı bir filtreyi seçtiğinde bu chip'ler görüntülenir ve üzerlerine tıklanarak filtre kaldırılabilir
export interface FilterChip {
  id: string;           // Chip'in benzersiz kimliği (örn: "type-park", "rating")
  label: string;        // Chip üzerinde gösterilen metin (örn: "Park", "4+ Stars")
  value: any;           // Chip'in temsil ettiği filtre değeri
  type: FilterChipType; // Chip'in hangi filtre türüne ait olduğu
  isActive: boolean;    // Chip aktif mi? (aktifse gösterilir)
}

// Chip türlerini tanımlayan enum — removeChip fonksiyonunda hangi filtrenin kaldırılacağını belirlemek için kullanılır
export enum FilterChipType {
  TYPE = 'type',       // Kategori filtresi
  PRICE = 'price',     // Fiyat filtresi
  RATING = 'rating',   // Puan filtresi
  TAG = 'tag',         // Etiket filtresi
  FEATURE = 'feature'  // Özellik filtresi (doğrulanmış, açık)
}