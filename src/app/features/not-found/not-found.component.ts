import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container text-center">
        <div class="text-7xl mb-4">🧭</div>
        <h1 class="text-2xl font-semibold mb-2">Page Not Found</h1>
        <p class="text-slate-600 mb-6">The page you’re looking for doesn’t exist.</p>
        <a routerLink="/" class="px-5 py-3 rounded-xl bg-water text-white">Go Home</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}

