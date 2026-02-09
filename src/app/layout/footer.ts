import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="flex justify-between items-center px-12 py-12" style="background: #12141a; border-top: 1px solid rgba(255,255,255,0.06);">
      <p style="font-size: 0.85rem; color: rgba(238,232,223,0.45);">
        © 2026 Spotted - In — Secret spots of the city, by the people. All rights reserved.
      </p>
      <div class="flex gap-6">
        <a href="#" class="footer-link" style="font-size: 0.85rem; color: rgba(238,232,223,0.45); text-decoration: none; transition: color 0.2s;">About</a>
        <a href="#" class="footer-link" style="font-size: 0.85rem; color: rgba(238,232,223,0.45); text-decoration: none; transition: color 0.2s;">Contact</a>
        <a href="#" class="footer-link" style="font-size: 0.85rem; color: rgba(238,232,223,0.45); text-decoration: none; transition: color 0.2s;">Terms of Use</a>
      </div>
    </footer>

    <style>
      .footer-link:hover {
        color: #c8a96e;
      }
    </style>
  `,
  styles: []
})
export class FooterComponent {}