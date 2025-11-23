import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminBlogListComponent } from './blog-list.component';
import { AdminBlogEditComponent } from './blog-edit.component';
import { AdminSignInComponent } from './signin.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'signin',
    component: AdminSignInComponent
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'blog',
        pathMatch: 'full'
      },
      {
        path: 'blog',
        children: [
          {
            path: '',
            component: AdminBlogListComponent
          },
          {
            path: 'create',
            component: AdminBlogEditComponent
          },
          {
            path: ':id/edit',
            component: AdminBlogEditComponent
          }
        ]
      }
    ]
  }
];
