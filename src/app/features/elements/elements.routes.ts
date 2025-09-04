// src/app/features/elements/elements.routes.ts
import { Routes } from '@angular/router';

export const ELEMENT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'earth' },
  {
    path: ':element',
    loadComponent: () => import('./element-shell.component').then((m) => m.ElementShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () => import('../tabs/element-overview.component').then(m => m.ElementOverviewComponent)
      },
      {
        path: 'widgets', 
        loadComponent: () => import('../tabs/element-widgets.component').then(m => m.ElementWidgetsComponent)
      },
      {
        path: 'in-focus',
        loadComponent: () => import('../tabs/element-in-focus.component').then(m => m.ElementInFocusComponent)
      },
      {
        path: 'voices',
        loadComponent: () => import('../tabs/element-voices.component').then(m => m.ElementVoicesComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('../tabs/element-blog.component').then(m => m.ElementBlogComponent)
      },
      {
        path: 'videos',
        loadComponent: () => import('../tabs/element-videos.component').then(m => m.ElementVideosComponent)
      },
      {
        path: 'take-action',
        loadComponent: () => import('../tabs/element-take-action.component').then(m => m.ElementTakeActionComponent)
      }
    ],
  },
];
