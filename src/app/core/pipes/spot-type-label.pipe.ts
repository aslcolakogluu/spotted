import { Pipe, PipeTransform } from '@angular/core';
import { SpotType } from '../models';

@Pipe({
  name: 'spotTypeLabel',
  standalone: true
})
export class SpotTypeLabelPipe implements PipeTransform {
  private readonly labelMap: Record<SpotType, string> = {
    [SpotType.BRIDGE]: 'Bridge',
    [SpotType.PARK]: 'Park',
    [SpotType.MUSEUM]: 'Museum',
    [SpotType.HISTORICAL]: 'Historical',
    [SpotType.BEACH]: 'Beach',
    [SpotType.SPORTS]: 'Sports',
    [SpotType.OTHER]: 'Other',
    [SpotType.NATURE]: ''
  };

  transform(type: SpotType): string {
    return this.labelMap[type] ?? 'Unknown';
  }
}