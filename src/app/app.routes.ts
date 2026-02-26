import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'explore',
    loadComponent: () =>
      import('./features/explore/explore').then((m) => m.ExploreComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./features/map/map').then((m) => m.MapComponent),
    canActivate: [authGuard],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'add-spot',
    loadComponent: () =>
      import('./features/add-spot/add-spot').then((m) => m.AddSpotComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact').then((m) => m.ContactComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./features/terms/terms').then((m) => m.TermsComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register').then((m) => m.RegisterComponent),
  },
];
