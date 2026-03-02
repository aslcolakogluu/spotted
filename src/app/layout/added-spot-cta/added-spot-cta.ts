// AddSpotCta (Call-to-Action) bileşeni — kullanıcıları mekan eklemeye yönlendiren tanıtım bölümü
// Ana sayfada featured spots bölümünün altında görüntülenir
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
  private router = inject(Router); // Mekan ekleme sayfasına yönlendirme için

  // "Add a Spot" butonuna tıklandığında mekan ekleme sayfasına yönlendirir
  // authGuard /add-spot rotasında oturumu kontrol eder
  navigateToAddSpot(): void {
    this.router.navigate(['/add-spot']);
  }
}
