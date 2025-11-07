// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./pages/impressum/impressum.component').then(m => m.ImpressumComponent),
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./pages/datenschutz/datenschutz.component').then(m => m.DatenschutzComponent),
  },
  { path: '**', redirectTo: '' },
];
