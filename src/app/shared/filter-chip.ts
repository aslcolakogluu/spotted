import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterChip } from '@core/models';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [],
  template: `
    <button
      [class]="getChipClasses()"
      (click)="handleClick()">
      <span>{{ chip.label }}</span>
      @if (removable) {
        <svg 
          class="w-4 h-4 ml-1.5"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      }
    </button>
  `,
  styles: []
})
export class FilterChipComponent {
  @Input() chip!: FilterChip; // FilterChip nesnesi, bu bileşenin görüntüleyeceği filtre bilgisini içerir, böylece her bir chip farklı bir filtreyi temsil eder
  @Input() removable: boolean = true; // Chip'in silinebilir olup olmadığını belirten bir boolean, böylece bazı chip'ler sadece tıklanabilir olabilirken bazıları silinebilir olarak ayarlanabilir
  @Output() removed = new EventEmitter<FilterChip>(); // Chip silindiğinde tetiklenen EventEmitter, böylece kullanıcı bir chip'i kaldırmak istediğinde bu olay yakalanarak gerekli işlemler yapılabilir
  @Output() clicked = new EventEmitter<FilterChip>(); // Chip tıklandığında tetiklenen EventEmitter, böylece kullanıcı bir chip'e tıkladığında bu olay yakalanarak gerekli işlemler yapılabilir, örneğin filtre uygulanabilir veya detay gösterilebilir

  handleClick(): void {
    if (this.removable) { // Eğer chip silinebilir ise, removed EventEmitter'ı tetiklenir, böylece kullanıcı bir chip'i kaldırmak istediğinde bu olay yakalanarak gerekli işlemler yapılabilir
      this.removed.emit(this.chip); // Eğer chip silinebilir değilse, clicked EventEmitter'ı tetiklenir, böylece kullanıcı bir chip'e tıkladığında bu olay yakalanarak gerekli işlemler yapılabilir, örneğin filtre uygulanabilir veya detay gösterilebilir
    } else {
      this.clicked.emit(this.chip);
    }
  }

  getChipClasses(): string {
    const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200';
    
    const activeClasses = this.chip.isActive
      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

    return `${baseClasses} ${activeClasses}`;
  }
}