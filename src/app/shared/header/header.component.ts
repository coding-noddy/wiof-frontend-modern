import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
          <a routerLink="/about" class="hover:text-water">About</a>
        </nav>
        <a
          routerLink="/get-involved"
          class="ml-4 inline-flex items-center px-4 py-2 rounded-full bg-water text-white text-sm shadow-soft hover:opacity-90"
        >
          Get Involved
        </a>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
