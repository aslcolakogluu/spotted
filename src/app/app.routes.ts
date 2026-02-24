import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'explore',
    loadComponent: () =>
      import('./features/explore/explore').then((m) => m.ExploreComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./features/map/map').then((m) => m.MapComponent),
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
];
