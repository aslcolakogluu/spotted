import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Spot } from '@core/models';
import { RatingStarsComponent } from '@shared/rating-stars/rating-stars';
import { SpotTypeIconPipe, SpotTypeLabelPipe } from '@core/pipes';

@Component({
  selector: 'app-spot-card',
  standalone: true,
  imports: [
    
    RatingStarsComponent,
    SpotTypeIconPipe,
    SpotTypeLabelPipe
  ],
  templateUrl: './spot-card.html',
  styleUrl: './spot-card.css',
  
})
export class SpotCardComponent {
  @Input() spot!: Spot; // Spot nesnesi, bu bileşenin görüntüleyeceği mekan bilgisini içerir, böylece her bir SpotCard farklı bir mekanı temsil eder
  @Output() spotClick = new EventEmitter<Spot>(); // Spot kartına tıklandığında tetiklenen EventEmitter, böylece kullanıcı bir spot kartına tıkladığında bu olay yakalanarak gerekli işlemler yapılabilir, örneğin detay sayfasına yönlendirme veya modal açma gibi işlemler gerçekleştirilebilir

  handleClick(): void { // Spot kartına tıklandığında spotClick EventEmitter'ı tetiklenir, böylece kullanıcı bir spot kartına tıkladığında bu olay yakalanarak gerekli işlemler yapılabilir, örneğin detay sayfasına yönlendirme veya modal açma gibi işlemler gerçekleştirilebilir
    this.spotClick.emit(this.spot);
  }
}