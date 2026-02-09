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
  @Input() chip!: FilterChip;
  @Input() removable: boolean = true;
  @Output() removed = new EventEmitter<FilterChip>();
  @Output() clicked = new EventEmitter<FilterChip>();

  handleClick(): void {
    if (this.removable) {
      this.removed.emit(this.chip);
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