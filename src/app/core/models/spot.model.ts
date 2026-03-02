// Spot (mekan) ile ilgili tüm veri tipleri bu dosyada tanımlanmıştır

// Ana mekan veri yapısı — bir mekanın sahip olduğu tüm alanları temsil eder
export interface Spot {
  id: string;           // Benzersiz mekan kimliği
  name: string;         // Mekanın adı
  type: SpotType;       // Mekan kategorisi (köprü, doğa, tarihi, vb.)
  description: string;  // Mekanın açıklaması
  address: string;      // Mekanın adresi
  latitude: number;     // Harita için enlem koordinatı
  longitude: number;    // Harita için boylam koordinatı
  rating: number;       // Ortalama kullanıcı puanı (0-5 arası)
  reviewCount: number;  // Toplam yorum sayısı
  tags: string[];       // Mekanı tanımlayan etiketler (örn: "sessiz", "romantik")
  openingHours?: string;  // Opsiyonel: çalışma saatleri
  priceRange?: string;    // Opsiyonel: fiyat aralığı (₺, ₺₺, vb.)
  isVerified: boolean;  // Admin tarafından doğrulanmış mı?
  isFeatured: boolean;  // Ana sayfada öne çıkarılıyor mu?
  createdAt: Date;      // Kaydın oluşturulma tarihi
  updatedAt: Date;      // Kaydın son güncellenme tarihi
  imageUrl: string;     // Mekanın kapak görseli URL'i
}

// Mekan kategorilerini tanımlayan enum
// Her değer, API/storage için kullanılan string karşılığını gösterir
export enum SpotType {
  BRIDGE = 'bridge',         // Köprü
  NATURE = 'nature',         // Doğa
  HISTORICAL = 'historical', // Tarihi
  PARK = 'park',             // Park
  MUSEUM = 'museum',         // Müze
  BEACH = 'beach',           // Plaj
  SPORTS = 'sports',         // Spor
  OTHER = 'other'            // Diğer
}

// Yeni mekan oluştururken kullanılan veri transfer objesi (DTO)
// id, rating, reviewCount gibi sistem tarafından üretilen alanlar burada yer almaz
export interface SpotCreateDto {
  name: string;
  type: SpotType;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;      // Opsiyonel: görselin verilmemesi durumunda placeholder kullanılır
  tags?: string[];
  openingHours?: string;
  priceRange?: string;
}

// Mevcut mekan güncellenirken kullanılan DTO
// Partial<SpotCreateDto> sayesinde yalnızca değişen alanlar gönderilebilir
export interface SpotUpdateDto extends Partial<SpotCreateDto> { // Partial kullandık çünkü güncelleme sırasında tüm alanların gönderilmesi zorunlu değil, sadece güncellenmek istenen alanlar gönderilebilir
  id: string; // Hangi mekanın güncelleneceğini belirten zorunlu alan
}