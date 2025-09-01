import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

type BlogCard = { title:string; slug:string; summary:string; heroUrl?:string; publishedAt?:any; };

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <a *ngFor="let a of articles()" [routerLink]="['/blog', a.slug]" class="card overflow-hidden block group">
      <div class="aspect-[16/9] bg-slate-200">
        <img *ngIf="a.heroUrl" [src]="a.heroUrl" class="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div class="p-4">
        <h3 class="font-semibold line-clamp-2">{{ a.title }}</h3>
        <p class="text-slate-600 text-sm mt-1 line-clamp-2">{{ a.summary }}</p>
      </div>
    </a>
  </div>

  <div class="mt-8 flex items-center justify-center gap-2">
    <button class="px-4 py-2 rounded-xl border" (click)="prev()" [disabled]="page()===1">Prev</button>
    <div class="text-sm">Page {{ page() }}</div>
    <button class="px-4 py-2 rounded-xl border" (click)="next()" [disabled]="!hasMore()">Next</button>
  </div>
  `
})
export class ElementBlogComponent {
  constructor(private route: ActivatedRoute) {
    effect(() => {
      const element = this.route.parent?.snapshot.paramMap.get('element') || 'earth';
      this.fetch(element, this.page());
    });
  }

  page = signal(1);
  articles = signal<BlogCard[]>([]);
  more = signal(false);

  async fetch(element: string, page: number) {
    // placeholder: wire to Firestore later
    const pageSize = 9;
    const mock = Array.from({length: pageSize}, (_,i) => ({
      title: `${element} Blog ${i+1 + (page-1)*pageSize}`,
      slug: `${element}-blog-${i+1 + (page-1)*pageSize}`,
      summary: 'Short description of the blog post.',
      heroUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'
    }));
    this.articles.set(mock);
    this.more.set(true); // flip based on real query later
  }
  prev(){ this.page.update(p => Math.max(1, p-1)); }
  next(){ this.page.update(p => p+1); }
  hasMore(){ return this.more(); }
}
