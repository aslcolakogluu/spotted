// İstatistik ile ilgili tüm veri tipleri bu dosyada tanımlanmıştır

// Uygulamanın genel istatistiklerini tutan arayüz
export interface Stats {
  totalSpots: number;              // Toplam mekan sayısı
  totalUsers: number;              // Toplam kullanıcı sayısı
  totalReviews: number;            // Toplam yorum sayısı
  totalVisits: number;             // Toplam ziyaret sayısı
  averageRating: number;           // Tüm mekanlardaki ortalama puan
  popularCategories: CategoryStat[]; // Kategorilere göre mekan istatistikleri
  recentActivity: ActivityStat[];    // Son 7 günün günlük aktivite istatistikleri
}

// Bir mekan kategorisinin istatistiklerini temsil eder
export interface CategoryStat {
  category: string;            // Kategori adı (örn: "Cafe", "Park")
  count: number;               // Bu kategorideki mekan sayısı
  percentage: number;          // Toplam içindeki yüzde oranı
  trend?: 'up' | 'down' | 'stable'; // Büyüme trendi (artıyor/azalıyor/sabit)
}

// Bir günün aktivite istatistiklerini temsil eder — grafik gösterimi için kullanılır
export interface ActivityStat {
  date: string;           // ISO format tarih (örn: "2024-02-15")
  spotsAdded: number;     // O gün eklenen mekan sayısı
  reviewsPosted: number;  // O gün yazılan yorum sayısı
  visits: number;         // O günkü ziyaret sayısı
}

// Belirli bir kullanıcının istatistiklerini tutan arayüz
export interface UserStats {
  userId: string;          // İstatistiklerin ait olduğu kullanıcı kimliği
  spotsAdded: number;      // Eklediği mekan sayısı
  spotsVisited: number;    // Ziyaret ettiği mekan sayısı
  reviewsWritten: number;  // Yazdığı yorum sayısı
  favoriteCount: number;   // Favori mekan sayısı
  followersCount: number;  // Takipçi sayısı
  followingCount: number;  // Takip ettiği kullanıcı sayısı
  memberSince: Date;       // Üyelik başlangıç tarihi
  badges: Badge[];         // Kazanılan rozetler
}

// Kullanıcının kazanabileceği rozetleri temsil eden arayüz
export interface Badge {
  id: string;          // Rozet kimliği (örn: "explorer", "contributor")
  name: string;        // Rozet adı (örn: "Explorer")
  description: string; // Rozeti kazanma koşulu (örn: "50 farklı mekan ziyaret edildi")
  iconUrl: string;     // Rozet ikonunun dosya yolu
  earnedAt: Date;      // Rozetin kazanıldığı tarih
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // Rozetin nadirliliği
}

// Trend istatistiklerini bir arada tutan arayüz
export interface TrendingStats {
  trendingSpots: TrendingSpot[];         // En çok trend olan mekanlar
  hotCategories: string[];               // Popüler kategoriler
  topContributors: TopContributor[];     // En çok katkı sağlayan kullanıcılar
}

// Trend olan bir mekanın istatistiklerini temsil eder
export interface TrendingSpot {
  spotId: string;      // Mekan kimliği
  spotName: string;    // Mekan adı
  trendScore: number;  // Trend skoru (0-100 arası)
  recentVisits: number; // Son dönemdeki ziyaret sayısı
  growthRate: number;  // Büyüme oranı (yüzde olarak)
}

// En çok katkı sağlayan kullanıcıyı temsil eder
export interface TopContributor {
  userId: string;            // Kullanıcı kimliği
  userName: string;          // Kullanıcı adı
  userAvatar?: string;       // Opsiyonel: profil görseli URL'i
  contributionScore: number; // Toplam katkı skoru
  spotsAdded: number;        // Eklediği mekan sayısı
  reviewsCount: number;      // Yazdığı yorum sayısı
}