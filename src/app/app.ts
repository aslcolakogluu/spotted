import { Component , signal} from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar';
import { HeroComponent } from './layout/hero';
import { FeaturedSpotComponent } from './layout/featured-spots';
import { ActivityListComponent } from './layout/activity-list';
import { AddSpotCtaComponent } from './layout/added-spot-cta';
import { FooterComponent } from './layout/footer';
import { Login } from '@features/login/login';
import { SpotMapComponent } from "@features/components/spot-map";
import { MapActivitySectionComponent } from "@features/components/map-activity";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturedSpotComponent,
    ActivityListComponent,
    AddSpotCtaComponent,
    FooterComponent,
    RouterOutlet, // sayfa geçiş
    Login,
    SpotMapComponent,
    MapActivitySectionComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'spotted-in';

  showLoginModal = signal(false);  

  openLoginModal(): void { 
    this.showLoginModal.set(true);
  }
  
  closeLoginModal(): void { 
    this.showLoginModal.set(false); 
  }

  handleAddSpotClick(): void { 
 
    console.log('Add Spot clicked');
  }



}