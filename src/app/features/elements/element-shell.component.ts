// element-shell.component.ts
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-element-shell',
  imports: [RouterLink, NgClass, RouterOutlet],
  template: `
  <section class="section">
    <div class="container">
      <p class="text-sm font-semibold" [ngClass]="colorClass()">Element</p>
      <h1 class="section-title">{{ name() }}</h1>
      <p class="section-sub">Explore {{ name() }}: Overview, Widgets, Focus Stories, Community Voices, Blogs, Videos, and Take Action.</p>

      <nav class="mt-6 flex flex-wrap gap-2 text-sm">
        <a [routerLink]="['./','overview']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Overview</a>
        <a [routerLink]="['./','widgets']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Widgets</a>
        <a [routerLink]="['./','in-focus']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">In Focus</a>
        <a [routerLink]="['./','voices']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Voices</a>
        <a [routerLink]="['./','blog']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Blogs</a>
        <a [routerLink]="['./','videos']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Videos</a>
        <a [routerLink]="['./','take-action']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Take Action</a>
      </nav>

      <div class="mt-8">
        <router-outlet />
      </div>
    </div>
  </section>
  `
})
export class ElementShellComponent {
  route = inject(ActivatedRoute);
  name = computed(() => {
    const e = this.route.snapshot.paramMap.get('element') || 'earth';
    return e.charAt(0).toUpperCase() + e.slice(1);
  });
  colorClass() {
    const e = this.route.snapshot.paramMap.get('element');
    return {
      'text-earth': e==='earth',
      'text-water': e==='water',
      'text-fire':  e==='fire',
      'text-air':   e==='air',
      'text-space': e==='space'
    };
  }
  hasTools() {
    // Example: only Earth has a tool for now; adjust later
    return (this.route.snapshot.paramMap.get('element') === 'earth');
  }
}
