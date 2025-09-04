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
    path: 'element',
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
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog/blog-detail.component').then((m) => m.BlogDetailComponent),
  },
  {
    path: 'quiz',
    loadComponent: () => import('./features/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'quiz/archive',
    loadComponent: () =>
      import('./features/quiz/quiz-archive.component').then((m) => m.QuizArchiveComponent),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
  },
  {
    path: 'focus/:type',
    loadComponent: () => import('./features/focus/focus.component').then((m) => m.FocusComponent),
  },
  {
    path: 'take-action',
    loadComponent: () =>
      import('./features/take-action/take-action.component').then((m) => m.TakeActionComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'donate',
    loadComponent: () => import('./features/donate/donate.component').then((m) => m.DonateComponent),
  },
  { path: '**', redirectTo: '' },
];
