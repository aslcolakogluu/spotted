import { Pipe, PipeTransform } from '@angular/core';
import { SpotType } from '../models';

@Pipe({
  name: 'spotTypeLabel',
  standalone: true
})
export class SpotTypeLabelPipe implements PipeTransform { //PipeTransform arayüzünü implement ediyoruz çünkü bu pipe'ı bir dönüşüm işlemi için kullanacağız
  private readonly labelMap: Record<SpotType, string> = { // Record türünde bir nesne oluşturuyoruz çünkü her bir SpotType türü için bir string değeri (etiket) saklayacağız
    [SpotType.BRIDGE]: 'Bridge',
    [SpotType.PARK]: 'Park',
    [SpotType.MUSEUM]: 'Museum',
    [SpotType.HISTORICAL]: 'Historical',
    [SpotType.BEACH]: 'Beach',
    [SpotType.SPORTS]: 'Sports',
    [SpotType.OTHER]: 'Other',
    [SpotType.NATURE]: ''
  };

  transform(type: SpotType): string { //PipeTransform arayüzündeki transform metodunu implement ediyoruz, bu metodun amacı verilen SpotType türüne karşılık gelen etiketi döndürmek
    return this.labelMap[type] ?? 'Unknown';
  }
}