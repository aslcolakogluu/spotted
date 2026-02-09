import { Pipe, PipeTransform } from '@angular/core';
import { SpotType } from '../models';

@Pipe({
  name: 'spotTypeLabel',
  standalone: true
})
export class SpotTypeLabelPipe implements PipeTransform {
  private readonly labelMap: Record<SpotType, string> = {
    [SpotType.CAFE]: 'Cafe',
    [SpotType.RESTAURANT]: 'Restaurant',
    [SpotType.PARK]: 'Park',
    [SpotType.MUSEUM]: 'Museum',
    [SpotType.SHOPPING]: 'Shopping',
    [SpotType.ENTERTAINMENT]: 'Entertainment',
    [SpotType.NIGHTLIFE]: 'Nightlife',
    [SpotType.SPORTS]: 'Sports',
    [SpotType.OTHER]: 'Other'
  };

  transform(type: SpotType): string {
    return this.labelMap[type] ?? 'Unknown';
  }
}