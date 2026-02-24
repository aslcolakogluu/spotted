import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-spot-cta',
  standalone: true,
  imports: [],
  templateUrl: './added-spot-cta.html',
  styleUrl: './added-spot-cta.css',
})
export class AddSpotCtaComponent {
  private router = inject(Router);

  navigateToAddSpot(): void {
    this.router.navigate(['/add-spot']);
  }
}
