import { Component, inject, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  authService = inject(AuthService);  // AuthService, kullanıcının kimlik doğrulama durumunu kontrol etmek için kullanılır, böylece navbar'da kullanıcı giriş yapmışsa + Add Spot butonu gösterilir, giriş yapmamışsa Login butonu gösterilir
  loginClicked = output<void>(); // Login butonuna tıklandığında tetiklenen EventEmitter, böylece kullanıcı giriş yapmaya çalıştığında gerekli işlemler gerçekleştirilir
  addSpotClicked = output<void>(); // + Add Spot butonuna tıklandığında tetiklenen EventEmitter, böylece kullanıcı yeni bir spot eklemek istediğinde gerekli işlemler gerçekleştirilir
}