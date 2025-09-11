import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Search</h1>
        <p class="section-sub mb-6">Results for "{{ query() }}"</p>

        <div *ngIf="results().length === 0" class="text-center text-slate-600 py-12">No results found.</div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a *ngFor="let item of results()" [routerLink]="item.link" class="card overflow-hidden block hover:shadow-md transition">
            <div class="aspect-video bg-slate-200 overflow-hidden" *ngIf="item.image">
              <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="p-4">
              <div class="text-xs text-slate-500 mb-1">{{ item.type }}</div>
              <h3 class="font-semibold leading-tight">{{ item.title }}</h3>
              <p class="text-slate-600 text-sm line-clamp-2" *ngIf="item.excerpt">{{ item.excerpt }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class SearchComponent {
  route = inject(ActivatedRoute);
  query = computed(() => (this.route.snapshot.queryParamMap.get('q') || '').trim().toLowerCase());

  private blog = [
    { title: 'The Future of Renewable Energy: Solar Power Innovations', slug: 'future-renewable-energy-solar', excerpt: 'Exploring cutting-edge solar technologies...', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop' },
    { title: 'Ocean Conservation: Protecting Marine Biodiversity', slug: 'ocean-conservation-marine-biodiversity', excerpt: 'How marine protected areas are helping restore oceans...', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600&auto=format&fit=crop' },
  ];
  private videos = [
    { title: 'Why Water Matters', slug: 'why-water-matters', image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=600&auto=format&fit=crop' },
    { title: 'Plant a Tree Today', slug: 'plant-a-tree', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600&auto=format&fit=crop' },
  ];
  private courses = [
    { title: 'Introduction to Sustainability', slug: 'intro-to-sustainability', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600&auto=format&fit=crop' },
  ];
  private events = [
    { title: 'World Cleanup Day', slug: 'world-cleanup-day', image: '' },
  ];

  results = computed(() => {
    const q = this.query();
    if (!q) return [] as { title: string; excerpt?: string; link: any[]; image?: string; type: string }[];
    const out: { title: string; excerpt?: string; link: any[]; image?: string; type: string }[] = [];
    for (const b of this.blog) {
      if (b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)) {
        out.push({ title: b.title, excerpt: b.excerpt, link: ['/blog', b.slug], image: b.image, type: 'Article' });
      }
    }
    for (const v of this.videos) {
      if (v.title.toLowerCase().includes(q)) {
        out.push({ title: v.title, link: ['/videos', v.slug], image: v.image, type: 'Video' });
      }
    }
    for (const c of this.courses) {
      if (c.title.toLowerCase().includes(q)) {
        out.push({ title: c.title, link: ['/focus', 'course'], image: c.image, type: 'Course' });
      }
    }
    for (const e of this.events) {
      if (e.title.toLowerCase().includes(q)) {
        out.push({ title: e.title, link: ['/calendar'], image: e.image, type: 'Event' });
      }
    }
    return out;
  });
}

