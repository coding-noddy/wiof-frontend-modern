import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { VideoCardComponent, VideoCardModel } from '../../shared/ui/video-card.component';

@Component({
  standalone: true,
  imports: [NgFor, RouterLink, VideoCardComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">{{ elementName() }} Videos</h2>
          <p class="text-slate-600">Educational content and inspiring stories</p>
        </div>
        <a routerLink="/videos" class="text-water hover:text-water/80 text-sm font-medium">
          View all videos
        </a>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-video-card
          *ngFor="let video of elementVideos()"
          [title]="video.title"
          [slug]="video.slug"
          [thumbnailUrl]="video.thumbnailUrl"
          [element]="video.element"
        />
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center gap-2">
        <button class="px-4 py-2 rounded-xl border" (click)="prev()" [disabled]="page === 1">Prev</button>
        <div class="text-sm">Page {{ page }}</div>
        <button class="px-4 py-2 rounded-xl border" (click)="next()" [disabled]="!hasMore">Next</button>
      </div>
    </div>
  `
})
export class ElementVideosComponent {
  route = inject(ActivatedRoute);
  page = 1;
  hasMore = true;
  
  element = computed(() => this.route.parent?.snapshot.paramMap.get('element') || 'earth');
  elementName = computed(() => this.element().charAt(0).toUpperCase() + this.element().slice(1));
  
  elementVideos(): VideoCardModel[] {
    const element = this.element() as 'earth' | 'water' | 'fire' | 'air' | 'space';
    const pageSize = 9;
    return Array.from({length: pageSize}, (_, i) => ({
      title: `${this.elementName()} Story ${i+1 + (this.page-1)*pageSize}`,
      slug: `${element}-video-${i+1 + (this.page-1)*pageSize}`,
      thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + i*1000000}?q=80&w=600&auto=format&fit=crop`,
      element: element
    }));
  }
  
  prev() {
    if (this.page > 1) {
      this.page--;
    }
  }
  
  next() {
    this.page++;
  }
}
