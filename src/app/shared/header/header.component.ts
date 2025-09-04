import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
      <div class="container flex items-center justify-between h-16">
        <a routerLink="/" class="flex items-center gap-2 font-semibold">
          <span
            class="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-water to-space"
          ></span>
          <span>World is One Family</span>
        </a>
        <nav class="hidden md:flex items-center gap-6 text-sm">
          <a routerLink="/element" class="hover:text-water">Elements</a>
          <a routerLink="/videos" class="hover:text-water">Videos</a>
          <a routerLink="/blog" class="hover:text-water">Blog</a>
          <a routerLink="/quiz" class="hover:text-water">Quiz</a>
          <a routerLink="/calendar" class="hover:text-water">Calendar</a>
          <a routerLink="/about" class="hover:text-water">About</a>
          <a routerLink="/donate" class="hover:text-water">Donate</a>
        </nav>
        <div class="flex items-center gap-3">
          <form class="hidden md:flex items-center gap-2" (submit)="onSearch(search.value); $event.preventDefault()">
            <input #search type="search" placeholder="Search" aria-label="Search site"
              class="w-40 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-water" />
            <button class="px-3 py-2 rounded-xl border border-slate-300 text-sm">Search</button>
          </form>
          <a
            routerLink="/take-action"
            class="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-water text-white text-sm shadow-soft hover:opacity-90"
          >
            Take Action
          </a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private router = inject(Router);
  onSearch(q: string) {
    const query = (q || '').trim();
    if (!query) return;
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
