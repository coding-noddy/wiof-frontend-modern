// src/app/features/elements/elements.routes.ts
import { Routes } from '@angular/router';

export const ELEMENT_ROUTES: Routes = [
  {
    path: ':element',
    loadComponent: () => import('./element-shell.component').then((m) => m.ElementShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'blog' },
      {
        path: 'blog',
        loadComponent: () =>
          import('../tabs/element-blog.component').then((m) => m.ElementBlogComponent),
      },
      //   { path: 'coffee', loadComponent: () => import('./tabs/element-coffee.component').then(m => m.ElementCoffeeComponent) },
      //   { path: 'videos', loadComponent: () => import('./tabs/element-videos.component').then(m => m.ElementVideosComponent) },
      //   { path: 'tools',  loadComponent: () => import('./tabs/element-tools.component').then(m => m.ElementToolsComponent) },
    ],
  },
];
