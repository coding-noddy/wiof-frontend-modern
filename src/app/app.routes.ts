import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    data: { description: 'A movement to live in harmony with Earth, Water, Fire, Air and Space. Learn, act and share for a thriving planet.' },
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  // Stubs for later pages
  {
    path: 'about',
    title: 'About',
    data: { description: 'Learn more about the World is One Family initiative.' },
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'search',
    title: 'Search',
    data: { description: 'Search articles, videos, courses and events.' },
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
  },
  // app.routes.ts
  {
    path: 'element',
    title: 'Elements',
    data: { description: 'Explore Earth, Water, Fire, Air and Space — learn, practice and share.' },
    loadChildren: () => import('./features/elements/elements.routes').then((m) => m.ELEMENT_ROUTES),
  },
  {
    path: 'videos',
    title: 'Videos',
    data: { description: 'Watch and share inspiring environmental stories and voices.' },
    loadComponent: () =>
      import('./features/videos/videos.component').then((m) => m.VideosComponent),
  },
  {
    path: 'blog',
    title: 'Blog',
    data: { description: 'Stories, insights, and updates from our community.' },
    loadComponent: () => import('./features/blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'blog/:slug',
    title: 'Blog — Article',
    data: { description: 'Read in-depth perspectives on sustainability and the five elements.' },
    loadComponent: () => import('./features/blog/blog-detail.component').then((m) => m.BlogDetailComponent),
  },
  {
    path: 'quiz',
    title: 'Quiz',
    data: { description: 'Test your knowledge with our weekly environment quiz.' },
    loadComponent: () => import('./features/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'quiz/archive',
    title: 'Quiz Archive',
    data: { description: 'Browse previous quizzes and challenge yourself anytime.' },
    loadComponent: () =>
      import('./features/quiz/quiz-archive.component').then((m) => m.QuizArchiveComponent),
  },
  {
    path: 'calendar',
    title: 'Environment Calendar',
    data: { description: 'Key environmental days and upcoming events.' },
    loadComponent: () =>
      import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
  },
  {
    path: 'focus/:type',
    title: 'In Focus',
    data: { description: 'Discover organizations, innovations, cities, and courses making an impact.' },
    loadComponent: () => import('./features/focus/focus.component').then((m) => m.FocusComponent),
  },
  {
    path: 'take-action',
    title: 'Take Action',
    data: { description: 'Small steps make a big difference. Join our actions.' },
    loadComponent: () =>
      import('./features/take-action/take-action.component').then((m) => m.TakeActionComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    data: { description: 'Reach out to collaborate, contribute or learn more.' },
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'donate',
    title: 'Donate',
    data: { description: 'Support environmental learning and action across communities.' },
    loadComponent: () => import('./features/donate/donate.component').then((m) => m.DonateComponent),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    data: { description: 'Our placeholder policy for the mock site.' },
    loadComponent: () => import('./features/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: '**',
    title: 'Not Found',
    data: { description: 'The page you’re looking for doesn’t exist.' },
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
