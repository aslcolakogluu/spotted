// Uygulamanın tüm sayfası için rota tanımlamaları bu dosyada yapılmaktadır
// Lazy loading kullanarak bileşenler yalnızca ihtiyaç duyulduğunda yüklenir (performans için)
// authGuard ile korunan rotalar yalnızca giriş yapmış kullanıcılar tarafından erişilebilir
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'explore', // Keşfet sayfası — yalnızca giriş yapmış kullanıcılara açık
    loadComponent: () =>
      import('./features/explore/explore').then((m) => m.ExploreComponent),
    canActivate: [authGuard], // authGuard, giriş yapılmamışsa /login'e yönlendirir
  },
  {
    path: 'login', // Giriş sayfası — herkese açık
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'map', // Harita sayfası — yalnızca giriş yapmış kullanıcılara açık
    loadComponent: () =>
      import('./features/map/map').then((m) => m.MapComponent),
    canActivate: [authGuard],
  },
  {
    path: 'about', // Hakkımızda sayfası — herkese açık
    loadComponent: () =>
      import('./features/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'add-spot', // Spot ekleme sayfası — yalnızca giriş yapmış kullanıcılara açık
    loadComponent: () =>
      import('./features/add-spot/add-spot').then((m) => m.AddSpotComponent),
    canActivate: [authGuard],
  },
  {
    path: 'contact', // İletişim sayfası — herkese açık
    loadComponent: () =>
      import('./features/contact/contact').then((m) => m.ContactComponent),
  },
  {
    path: 'terms', // Kullanım koşulları sayfası — herkese açık
    loadComponent: () =>
      import('./features/terms/terms').then((m) => m.TermsComponent),
  },
  {
    path: 'register', // Kayıt sayfası — herkese açık
    loadComponent: () =>
      import('./features/register/register').then((m) => m.RegisterComponent),
  },
];
