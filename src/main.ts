import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig) // bootstrap işlemi, AppComponent'i başlatır ve appConfig ile yapılandırılır
  .catch((err) => console.error(err)); // Başlatma sırasında oluşabilecek hataları yakalar ve konsola yazdırır