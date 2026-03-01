import { CanActivateFn, Router } from '@angular/router'; //Canactivate ve Router'ı import ediyoruz
import { AuthService } from '../services/auth.service';  
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => { //authGuard fonksiyonunu tanımlıyoruz çünkü CanActivateFn türünde bir fonksiyon olacak
  const authService = inject(AuthService); //AuthService'i inject ediyoruz böylece bu fonksiyon içinde authService'i kullanabileceğiz
  const router = inject(Router); //Router'ı inject ediyoruz böylece bu fonksiyon içinde router'ı kullanabileceğiz

  if (authService.isAuthenticated()) { //isAuthenticated() fonksiyonu ile kullanıcının kimlik doğrulamasının yapılıp yapılmadığını kontrol ediyoruz
    return true; //Eğer kullanıcı kimlik doğrulaması yapmışsa, true döndürüyoruz ve rota erişimine izin veriyoruz
  }

  router.navigate(['/login']); //Eğer kullanıcı kimlik doğrulaması yapmamışsa, login sayfasına yönlendiriyoruz
  return false; //Rota erişimine izin vermiyoruz ve false döndürüyoruz
};
