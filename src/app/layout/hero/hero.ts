// Hero (ana sayfa karşılama bölümü) bileşeni — uygulamanın ilk izlenimini oluşturan bileşen
// Üst kısımdaki büyük başlık, açıklama metni ve keşfet/harita butonlarını içerir
import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class HeroComponent {
  private router = inject(Router); // Keşfet ve harita butonlarında yönlendirme için

  // Ana sayfada gösterilen istatistik sayaçları — reaktif olarak güncellenebi
  stats = signal([
    { value: '47', label: 'Discovered Spots' },  // Keşfedilen toplam mekan sayısı
    { value: '128', label: 'Reviews' },            // Yazılan toplam yorum sayısı
    { value: '23', label: 'Active Explorers' },    // Aktif kullanıcı sayısı
    { value: '4.6', label: 'Average Quietness' }  // Ortalama sessizlik puanı
  ]);

  // "Explore" butonuna tıklandığında keşfet sayfasına yönlendirir
  onExploreClick(): void {
    this.router.navigate(['/explore']);
  }

  // "View Map" butonuna tıklandığında harita sayfasına yönlendirir
  onMapClick(): void {
    this.router.navigate(['/map']);
  }
}