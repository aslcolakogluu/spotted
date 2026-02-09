import { Component } from '@angular/core';

@Component({
  selector: 'app-add-spot-cta',
  standalone: true,
  imports: [],
  template: `
    <section class="px-12 py-18">
      <div class="text-center p-14" style="background: #12141a; margin-top: 16px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;">
        <div style="font-size: 3rem; margin-bottom: 16px;">📍</div>
        <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 600; color: #eee8df; margin-bottom: 12px;">
          Do you have a spot too?
        </h3>
        <p style="font-size: 1rem; color: rgba(238,232,223,0.45); max-width: 500px; margin: 0 auto 28px; line-height: 1.6;">
          If you've discovered a quiet, beautiful place in the city, share it. Other explorers will find it too.
        </p>
        <button class="btn-hero-primary">+ Add Spot</button>
      </div>
    </section>

    <style>
      .btn-hero-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 30px;
        border-radius: 8px;
        font-size: 0.88rem;
        font-weight: 500;
        letter-spacing: 0.04em;
        background: #c8a96e;
        color: #0a0b0d;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .btn-hero-primary:hover {
        background: #d9bf84;
        transform: translateY(-1px);
      }
    </style>
  `,
  styles: []
})
export class AddSpotCtaComponent {}