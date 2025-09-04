import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  // Stubs for later pages
  {
    path: 'about',
    title: 'About',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  // app.routes.ts
  {
    path: 'element',
    title: 'Elements',
    loadChildren: () => import('./features/elements/elements.routes').then((m) => m.ELEMENT_ROUTES),
  },
  {
    path: 'videos',
    title: 'Videos',
    loadComponent: () =>
      import('./features/videos/videos.component').then((m) => m.VideosComponent),
  },
  {
    path: 'blog',
    title: 'Blog',
    loadComponent: () => import('./features/blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'blog/:slug',
    title: 'Blog — Article',
    loadComponent: () => import('./features/blog/blog-detail.component').then((m) => m.BlogDetailComponent),
  },
  {
    path: 'quiz',
    title: 'Quiz',
    loadComponent: () => import('./features/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'quiz/archive',
    title: 'Quiz Archive',
    loadComponent: () =>
      import('./features/quiz/quiz-archive.component').then((m) => m.QuizArchiveComponent),
  },
  {
    path: 'calendar',
    title: 'Environment Calendar',
    loadComponent: () =>
      import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
  },
  {
    path: 'focus/:type',
    title: 'In Focus',
    loadComponent: () => import('./features/focus/focus.component').then((m) => m.FocusComponent),
  },
  {
    path: 'take-action',
    title: 'Take Action',
    loadComponent: () =>
      import('./features/take-action/take-action.component').then((m) => m.TakeActionComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'donate',
    title: 'Donate',
    loadComponent: () => import('./features/donate/donate.component').then((m) => m.DonateComponent),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    loadComponent: () => import('./features/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
