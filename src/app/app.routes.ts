import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  // Stubs for later pages
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  // app.routes.ts
  {
    path: 'elements',
    loadChildren: () => import('./features/elements/elements.routes').then((m) => m.ELEMENT_ROUTES),
  },
  {
    path: 'videos',
    loadComponent: () =>
      import('./features/videos/videos.component').then((m) => m.VideosComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog.component').then((m) => m.BlogComponent),
  },
  { path: '**', redirectTo: '' },
];
