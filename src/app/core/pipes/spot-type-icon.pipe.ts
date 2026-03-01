import { Pipe, PipeTransform } from '@angular/core';
import { SpotType } from '../models';

@Pipe({
  name: 'spotTypeIcon',
  standalone: true // Bu pipe'ı standalone olarak tanımlıyoruz, böylece herhangi bir modüle eklemeden doğrudan kullanabiliriz
})
export class SpotTypeIconPipe implements PipeTransform { //PipeTransform arayüzünü implement ediyoruz çünkü bu pipe'ı bir dönüşüm işlemi için kullanacağız
  private readonly iconMap: Record<SpotType, string> = { // Record türünde bir nesne oluşturuyoruz çünkü her bir SpotType türü için bir string değeri (SVG ikonu) saklayacağız
    [SpotType.BRIDGE]: this.createSvg('M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'),
    [SpotType.NATURE]: this.createSvg('M12 6v6m0 0v6m0-6h6m-6 0H6'),
    [SpotType.HISTORICAL]: this.createSvg('M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'),
    [SpotType.MUSEUM]: this.createSvg('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'),
    [SpotType.BEACH]: this.createSvg('M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'),
    [SpotType.SPORTS]: this.createSvg('M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'),
    [SpotType.OTHER]: this.createSvg('M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0__016 0z'),
    [SpotType.PARK]: ''
  };

  private createSvg(path: string): string { // SVG ikonu oluşturmak için bir yardımcı fonksiyon tanımlıyoruz, bu fonksiyon verilen path değerini kullanarak bir SVG string'i döndürüyor
    return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}"></path>
    </svg>`;
  }

  transform(type: SpotType): string { //PipeTransform arayüzündeki transform metodunu implement ediyoruz, bu metodun amacı verilen SpotType türüne karşılık gelen SVG ikonunu döndürmek
    return this.iconMap[type] ?? this.iconMap[SpotType.OTHER]; //Eğer verilen SpotType türü iconMap içinde tanımlı değilse, OTHER türüne karşılık gelen ikonu döndürüyoruz
  }
}