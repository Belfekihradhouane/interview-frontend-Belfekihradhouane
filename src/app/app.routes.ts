import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'search',
    loadComponent: () => import('./search-form/search-form.component').then(m => m.SearchFormComponent)
  },
  {
    path: 'find-cities',
    loadComponent: () => import('./find-cities/find-cities.component').then(m => m.FindCitiesComponent)
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' }
];
