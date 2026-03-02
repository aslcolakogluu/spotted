// Kullanıcı aktiviteleri ile ilgili tüm veri tipleri bu dosyada tanımlanmıştır
import { Spot } from './spot.model'; // Spot modelini import ediyoruz çünkü Activity modelinde Spot ile ilgili bilgiler de olacak

// Bir kullanıcı aktivitesini temsil eden arayüz
export interface Activity {
  id: string;               // Benzersiz aktivite kimliği
  type: ActivityType;       // Aktivite türü (spot ekleme, yorum yazma, vb.)
  userId: string;           // Aktiviteyi gerçekleştiren kullanıcının kimliği
  userName: string;         // Kullanıcının görünen adı
  userAvatar?: string;      // Opsiyonel: kullanıcı profil görseli URL'i
  spotId?: string;          // Opsiyonel: aktivitenin ilgili olduğu mekan kimliği
  spot?: Spot;              // Opsiyonel: ilgili mekan objesi (join edilmiş veri)
  action: string;           // Aktivite açıklaması (örn: "Adding a new spot")
  description?: string;     // Opsiyonel: ek açıklama (örn: mekan adı)
  timestamp: Date;          // Aktivitenin gerçekleştiği zaman damgası
  metadata?: ActivityMetadata; // Opsiyonel: aktiviteye özel ek veriler
}

// Aktivite türlerini tanımlayan enum
export enum ActivityType {
  SPOT_ADDED = 'spot_added',         // Yeni mekan eklendi
  SPOT_REVIEWED = 'spot_reviewed',   // Mekana yorum yazıldı
  SPOT_VISITED = 'spot_visited',     // Mekan ziyaret edildi
  SPOT_FAVORITED = 'spot_favorited', // Mekan favorilere eklendi
  SPOT_SHARED = 'spot_shared',       // Mekan paylaşıldı
  USER_JOINED = 'user_joined'        // Kullanıcı topluluğa katıldı
}

// Aktiviteye ait ek meta veriler — aktivite türüne göre farklı alanlar kullanılabilir
export interface ActivityMetadata {
  rating?: number;        // Yorum puanı (SPOT_REVIEWED için)
  reviewText?: string;    // Yorum metni (SPOT_REVIEWED için)
  photoUrls?: string[];   // Eklenen görseller
  shareCount?: number;    // Paylaşım sayısı (SPOT_SHARED için)
  [key: string]: any;     // key değeri string, value ise herhangi bir tür olabilir (genişletilebilir yapı)
}

// Aktiviteleri filtrelemek için kullanılan arayüz
export interface ActivityFilter {
  type?: ActivityType[];  // Belirli türdeki aktiviteleri filtrele
  userId?: string;        // Belirli kullanıcıya ait aktiviteleri getir
  spotId?: string;        // Belirli mekana ait aktiviteleri getir
  startDate?: Date;       // Başlangıç tarihi filtresi
  endDate?: Date;         // Bitiş tarihi filtresi
  limit?: number;         // Maksimum kayıt sayısı
  offset?: number;        // Sayfalama için başlangıç indeksi
}