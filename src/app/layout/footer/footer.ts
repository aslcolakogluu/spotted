// Footer (alt bilgi) bileşeni — tüm sayfalarda görüntülenen alt navigasyon ve telif hakkı alanı
// RouterLink ile uygulama içi navigasyon linkleri sağlar
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router"; // Dahili sayfa rotalarına link vermek için

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink], // Footer linkleri Angular Router'ı kullanır (tam sayfa yenileme yoktur)
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent { } // Footer yalnızca statik içerik ve linklerden oluştuğundan class boş