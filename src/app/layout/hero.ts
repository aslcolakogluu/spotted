import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section class="relative flex flex-col justify-end px-12 pb-20 overflow-hidden" style="height: 100vh;">
      <!-- Background -->
      <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(10,11,13,0.15) 0%, rgba(10,11,13,0.7) 60%, #0a0b0d 100%), linear-gradient(135deg, #1a2530 0%, #0d1117 40%, #1a1520 70%, #0d1117 100%); background-size: cover;"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 80% 50% at 30% 40%, rgba(40,60,80,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 75% 55%, rgba(60,40,60,0.25) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 60% 25%, rgba(80,100,60,0.2) 0%, transparent 70%);"></div>
      
      <!-- Content -->
      <div class="relative z-10" style="max-width: 620px;">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6" style="background: rgba(200,169,110,0.15); border: 1px solid rgba(200,169,110,0.2); border-radius: 20px; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #c8a96e;">
          <span class="dot" style="width: 6px; height: 6px; background: #6fbf82; border-radius: 50%; animation: pulse 2s infinite;"></span>
          <span>Quiet corners of the city</span>
        </div>
        
        <h1 style="font-family: 'Playfair Display', serif; font-size: clamp(2.8rem, 6vw, 4.5rem); font-weight: 600; line-height: 1.1; color: #eee8df; margin-bottom: 18px;">
          Explore, <em style="font-style: italic; color: #c8a96e;">Share</em>,<br/>
          Find the City's Hidden Gems
        </h1>
        
        <p style="font-size: 1.05rem; font-weight: 300; line-height: 1.7; color: rgba(238,232,223,0.45); max-width: 480px; margin-bottom: 36px;">
          Discover quiet and inspiring spots away from the city's noise.
          Find a quiet corner for yourself during the quiet hours.
        </p>

        <div class="flex gap-3.5 flex-wrap">
          <button class="btn-hero-primary">Explore →</button>
          <button class="btn-hero-secondary">Map View</button>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <div class="flex gap-12 px-12 py-7" style="background: #12141a; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);">
      <div class="flex flex-col gap-1">
        <span style="font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 600; color: #eee8df;">47</span>
        <span style="font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(238,232,223,0.45);">Discovered Spots</span>
      </div>
      <div class="flex flex-col gap-1">
        <span style="font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 600; color: #eee8df;">128</span>
        <span style="font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(238,232,223,0.45);">Reviews</span>
      </div>
      <div class="flex flex-col gap-1">
        <span style="font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 600; color: #eee8df;">23</span>
        <span style="font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(238,232,223,0.45);">Active Explorers</span>
      </div>
      <div class="flex flex-col gap-1">
        <span style="font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 600; color: #eee8df;">4.6</span>
        <span style="font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(238,232,223,0.45);">Average Quietness</span>
      </div>
    </div>

    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
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
      
      .btn-hero-secondary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 30px;
        border-radius: 8px;
        font-size: 0.88rem;
        font-weight: 500;
        letter-spacing: 0.04em;
        background: rgba(255,255,255,0.06);
        color: #eee8df;
        border: 1px solid rgba(255,255,255,0.06);
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .btn-hero-secondary:hover {
        background: rgba(255,255,255,0.1);
      }
    </style>
  `,
  styles: []
})
export class HeroComponent {}