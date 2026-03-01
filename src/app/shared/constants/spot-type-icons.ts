import { SpotType } from '@core/models';

export interface SpotTypeInfo {
    value: SpotType;
    label: string;
    icon: string;
}

const svgIcon = (path: string): string =>
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

export const SPOT_TYPE_ICONS: Record<SpotType, string> = {
    [SpotType.NATURE]: svgIcon('<path d="M12 2L2 22h20L12 2z"/><path d="M12 10v6"/>'),
    [SpotType.PARK]: svgIcon('<path d="M12 3c-1.5 4-5 6-5 10a5 5 0 0010 0c0-4-3.5-6-5-10z"/><line x1="12" y1="17" x2="12" y2="22"/>'),
    [SpotType.BRIDGE]: svgIcon('<path d="M4 18h16"/><path d="M4 18c0-4 3.5-7 8-7s8 3 8 7"/><line x1="8" y1="18" x2="8" y2="11"/><line x1="16" y1="18" x2="16" y2="11"/>'),
    [SpotType.HISTORICAL]: svgIcon('<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/>'),
    [SpotType.MUSEUM]: svgIcon('<path d="M2 20h20"/><path d="M4 20V10"/><path d="M20 20V10"/><path d="M12 4L2 10h20L12 4z"/><path d="M8 14v2"/><path d="M12 14v2"/><path d="M16 14v2"/>'),
    [SpotType.BEACH]: svgIcon('<path d="M17.5 19a2.5 2.5 0 01-5 0c0-1.5 2.5-4 2.5-4s2.5 2.5 2.5 4z"/><path d="M2 22c3-3 5-3 8 0s5 3 8 0 5-3 8 0"/><circle cx="12" cy="6" r="4"/>'),
    [SpotType.SPORTS]: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/>'),
    [SpotType.OTHER]: svgIcon('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>'),
};

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

export function getSpotTypeIcon(type: SpotType): string {
    return SPOT_TYPE_ICONS[type] || SPOT_TYPE_ICONS[SpotType.OTHER];
}

export function getSpotTypeLabel(type: SpotType): string {
    const found = SPOT_TYPES.find((t) => t.value === type);
    return found?.label || 'Other';
}
