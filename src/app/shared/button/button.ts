import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Output() clicked = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  getButtonClasses(): string {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
      primary:
        'bg-yellow-700 text-black hover:bg-yellow-600 focus:ring-yellow-500',
      secondary:
        'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-yellow-500',
      outline:
        'border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-900 hover:bg-opacity-10 focus:ring-yellow-500',
      ghost:
        'text-yellow-700 hover:bg-yellow-900 hover:bg-opacity-10 focus:ring-yellow-500',
      danger: 'bg-red-700 text-white hover:bg-red-600 focus:ring-red-500',
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${widthClass}`;
  }
}
