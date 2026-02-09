import { Component } from '@angular/core';
import { NavbarComponent } from './layout/navbar';
import { HeroComponent } from './layout/hero';
import { FeaturedSpotComponent } from './layout/featured-spots';
import { ActivityListComponent } from './layout/activity-list';
import { AddSpotCtaComponent } from './layout/added-spot-cta';
import { FooterComponent } from './layout/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturedSpotComponent,
    ActivityListComponent,
    AddSpotCtaComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'spotted-in';
}