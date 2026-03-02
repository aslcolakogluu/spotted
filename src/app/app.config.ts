// Uygulamanın genel konfigürasyonu bu dosyada tanımlanmaktadır
// Angular'ın standalone API'si ile provideRouter kullanılarak router servisi sağlanır
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

// appConfig: Angular'ın uygulama genelinde kullanacağı servis ve yapılandırmaları barındırır
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, // Uygulama rotaları
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }), // Sayfa geçişlerinde scroll pozisyonunu en üste sıfırlar
    ),
  ],
};
