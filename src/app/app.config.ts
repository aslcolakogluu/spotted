import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // Angular uygulamasında yönlendirme (routing) sağlamak için gerekli olan router'ı sağlayan bir provider, böylece uygulama içinde farklı sayfalara geçiş yapılabilir
  ]
};