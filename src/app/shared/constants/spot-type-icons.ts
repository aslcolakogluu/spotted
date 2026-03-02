// Shared (paylaşılan) mekan türü sabitleri ve yardımcı fonksiyonlar
// Bu dosya mekan türü bilgilerini (ikon, etiket) merkezi olarak yönetir
// Hem explore hem de map bileşenlerinde kullanılır
import { SpotType } from '@core/models';

// Bir mekan türünün UI'da ihtiyaç duyduğu tüm bilgileri içeren arayüz
export interface SpotTypeInfo {
    value: SpotType;  // Enum değeri (örn: SpotType.PARK)
    label: string;    // Kullanıcıya gösterilen metin (örn: "Park")
    icon: string;     // SVG ikon string'i
}

// SVG ikon oluşturucu yardımcı fonksiyon
// path parametresi SVG path verisidir — her mekan türü için özel çizim talimatları
const svgIcon = (path: string): string =>
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

// Mekan türü → SVG ikon eşlemesi
// Record<SpotType, string> ile TypeScript tüm enum değerlerinin kapsandığını garantiler
export const SPOT_TYPE_ICONS: Record<SpotType, string> = {
    [SpotType.NATURE]: svgIcon('<path d="M12 2L2 22h20L12 2z"/><path d="M12 10v6"/>'),   // Üçgen (ağaç) şekli
    [SpotType.PARK]: svgIcon('<path d="M12 3c-1.5 4-5 6-5 10a5 5 0 0010 0c0-4-3.5-6-5-10z"/><line x1="12" y1="17" x2="12" y2="22"/>'), // Balon/ağaç
    [SpotType.BRIDGE]: svgIcon('<path d="M4 18h16"/><path d="M4 18c0-4 3.5-7 8-7s8 3 8 7"/><line x1="8" y1="18" x2="8" y2="11"/><line x1="16" y1="18" x2="16" y2="11"/>'), // Köprü kemeri
    [SpotType.HISTORICAL]: svgIcon('<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/>'), // Ev/tarihi bina
    [SpotType.MUSEUM]: svgIcon('<path d="M2 20h20"/><path d="M4 20V10"/><path d="M20 20V10"/><path d="M12 4L2 10h20L12 4z"/><path d="M8 14v2"/><path d="M12 14v2"/><path d="M16 14v2"/>'), // Sütunlu bina
    [SpotType.BEACH]: svgIcon('<path d="M17.5 19a2.5 2.5 0 01-5 0c0-1.5 2.5-4 2.5-4s2.5 2.5 2.5 4z"/><path d="M2 22c3-3 5-3 8 0s5 3 8 0 5-3 8 0"/><circle cx="12" cy="6" r="4"/>'), // Ay ve deniz dalgası
    [SpotType.SPORTS]: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/>'), // Futbol topu
    [SpotType.OTHER]: svgIcon('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>'), // Konum pini
};

// Kategori filtre butonları ve seçim listeleri için tam SpotTypeInfo dizisi
// Sıra UI'daki gösterim sırasını belirler
export const SPOT_TYPES: SpotTypeInfo[] = [
    { value: SpotType.NATURE, label: 'Nature', icon: SPOT_TYPE_ICONS[SpotType.NATURE] },
    { value: SpotType.PARK, label: 'Park', icon: SPOT_TYPE_ICONS[SpotType.PARK] },
    { value: SpotType.BRIDGE, label: 'Bridge', icon: SPOT_TYPE_ICONS[SpotType.BRIDGE] },
    { value: SpotType.HISTORICAL, label: 'Historical', icon: SPOT_TYPE_ICONS[SpotType.HISTORICAL] },
    { value: SpotType.MUSEUM, label: 'Museum', icon: SPOT_TYPE_ICONS[SpotType.MUSEUM] },
    { value: SpotType.BEACH, label: 'Beach', icon: SPOT_TYPE_ICONS[SpotType.BEACH] },
    { value: SpotType.SPORTS, label: 'Sports', icon: SPOT_TYPE_ICONS[SpotType.SPORTS] },
    { value: SpotType.OTHER, label: 'Other', icon: SPOT_TYPE_ICONS[SpotType.OTHER] },
];

// Verilen SpotType için SVG ikonunu döndürür
// Tanımsız tür gelirse güvenli fallback olarak OTHER ikonu kullanılır
export function getSpotTypeIcon(type: SpotType): string {
    return SPOT_TYPE_ICONS[type] || SPOT_TYPE_ICONS[SpotType.OTHER];
}

// Verilen SpotType için kullanıcıya gösterilecek etiketi döndürür
// Tanımsız tür gelirse 'Other' döner
export function getSpotTypeLabel(type: SpotType): string {
    const found = SPOT_TYPES.find((t) => t.value === type);
    return found?.label || 'Other';
}
