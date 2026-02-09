# Spotted In - Mekan Keşif Platformu

Angular 21, TypeScript ve Tailwind CSS ile geliştirilmiş modern bir mekan keşif ve paylaşım platformu.

## 🚀 Özellikler

### ✨ Temel Özellikler
- **Mekan Keşfi**: Şehrinizdeki en iyi mekanları keşfedin
- **Yorumlama**: Deneyimlerinizi paylaşın ve yorum yapın
- **Kategoriler**: Kafe, restoran, park, müze ve daha fazlası
- **Filtreleme**: Gelişmiş filtreleme seçenekleri
- **Harita Görünümü**: Mekanları harita üzerinde görün
- **Aktivite Akışı**: Toplulukta neler olduğunu takip edin

### 🎨 Teknik Özellikler
- **Angular 21**: En son Angular özellikleri
- **Standalone Components**: Modül gerektirmeyen bağımsız bileşenler
- **Signals**: Modern reaktif programlama
- **TypeScript**: Tam tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reaktif programlama
- **Responsive**: Tüm cihazlarda mükemmel görünüm

## 📁 Proje Yapısı

```
spotted-in/
├── src/
│   ├── app/
│   │   ├── core/                    # Core modülü
│   │   │   ├── models/              # Veri modelleri
│   │   │   │   ├── spot.model.ts
│   │   │   │   ├── activity.model.ts
│   │   │   │   ├── filter.model.ts
│   │   │   │   └── stats.model.ts
│   │   │   ├── services/            # Servisler
│   │   │   │   ├── spot.services.ts
│   │   │   │   ├── activity.service.ts
│   │   │   │   ├── filter.service.ts
│   │   │   │   └── stats.service.ts
│   │   │   └── pipes/               # Pipe'lar
│   │   │       ├── spot-type-icon.pipe.ts
│   │   │       └── spot-type-label.pipe.ts
│   │   ├── shared/                  # Paylaşılan bileşenler
│   │   │   └── components/
│   │   │       ├── button/
│   │   │       ├── rating-stars/
│   │   │       ├── filter-chip/
│   │   │       ├── spot-card/
│   │   │       └── activity-item/
│   │   ├── layout/                  # Layout bileşenleri
│   │   │   ├── nav/
│   │   │   ├── hero/
│   │   │   ├── stats-bar/
│   │   │   ├── featured-spot/
│   │   │   ├── activity-list/
│   │   │   ├── add-spot-cta/
│   │   │   └── footer/
│   │   ├── features/                # Feature modülleri
│   │   │   ├── home/
│   │   │   ├── map/
│   │   │   └── spots/
│   │   ├── app.ts                   # Ana component
│   │   ├── app.html                 # Ana template
│   │   ├── app.css                  # Ana stil
│   │   ├── app.config.ts            # Uygulama config
│   │   └── app.routes.ts            # Route tanımları
│   ├── main.ts                      # Uygulama giriş noktası
│   ├── index.html                   # Ana HTML
│   └── styles.scss                  # Global stiller
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Tarayıcınızda açın
# http://localhost:4200
```

## 📦 Kullanılan Teknolojiler

- **Angular 21**: Web framework
- **TypeScript 5.7**: Programlama dili
- **Tailwind CSS 3.4**: CSS framework
- **RxJS 7.8**: Reaktif programlama
- **Vite 6.0**: Build tool (alternatif)

## 🎯 Temel Kavramlar

### Models (Modeller)
- `Spot`: Mekan bilgileri
- `Activity`: Kullanıcı aktiviteleri
- `Filter`: Filtreleme seçenekleri
- `Stats`: İstatistik verileri

### Services (Servisler)
- `SpotService`: Mekan CRUD işlemleri
- `ActivityService`: Aktivite yönetimi
- `FilterService`: Filtreleme işlemleri
- `StatsService`: İstatistik hesaplamaları

### Components (Bileşenler)

#### Shared Components
- `ButtonComponent`: Özelleştirilebilir buton
- `RatingStarsComponent`: Yıldız derecelendirme
- `FilterChipComponent`: Filtre chipleri
- `SpotCardComponent`: Mekan kartı
- `ActivityItemComponent`: Aktivite öğesi

#### Layout Components
- `NavbarComponent`: Üst navigasyon
- `HeroComponent`: Hero bölümü
- `StatsBarComponent`: İstatistik barı
- `FeaturedSpotComponent`: Öne çıkan mekanlar
- `ActivityListComponent`: Aktivite listesi
- `AddSpotCtaComponent`: Mekan ekleme CTA
- `FooterComponent`: Alt bilgi

## 🎨 Stil Kılavuzu

### Renkler
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#a855f7)
- **Accent**: Pink (#ec4899)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Tipografi
- **Font**: Inter
- **Başlıklar**: 700-800 weight
- **Normal metin**: 400-500 weight
- **Vurgular**: 600 weight

## 🔧 Geliştirme

### Yeni Bileşen Ekleme
```bash
# Standalone component oluşturma
ng generate component components/my-component --standalone
```

### Yeni Servis Ekleme
```bash
# Servis oluşturma
ng generate service services/my-service
```

### Build
```bash
# Production build
npm run build

# Build dosyaları dist/ klasöründe olacak
```

## 📱 Responsive Tasarım

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

```bash
# Production build
npm run build

# Preview build
npm run preview
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

MIT

## 👥 Ekip

- **Frontend**: Angular 21 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: RxJS + Signals
- **Icons**: Heroicons (SVG)

## 📞 İletişim

Sorularınız için: info@spottedin.com

---

**Spotted In** ile şehrinizi keşfedin! 🎉