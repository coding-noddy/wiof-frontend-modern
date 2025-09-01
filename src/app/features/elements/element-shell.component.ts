// element-shell.component.ts
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-element-shell',
  imports: [RouterLink, NgClass, RouterOutlet],
  template: `
  <section class="section">
    <div class="container">
      <p class="text-sm font-semibold" [ngClass]="colorClass()">Element</p>
      <h1 class="section-title">{{ name() }}</h1>
      <p class="section-sub">Explore {{ name() }}: Blogs, Coffee Conversations, Videos{{ hasTools() ? ', Tools' : '' }}.</p>

      <nav class="mt-6 flex flex-wrap gap-2 text-sm">
        <a [routerLink]="['./','blog']"   routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Blogs</a>
        <a [routerLink]="['./','coffee']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Coffee Conversations</a>
        <a [routerLink]="['./','videos']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Videos</a>
        <a @If hasTools() [routerLink]="['./','tools']" routerLinkActive="bg-slate-900 text-white" class="px-3 py-2 rounded-xl border">Tools</a>
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
