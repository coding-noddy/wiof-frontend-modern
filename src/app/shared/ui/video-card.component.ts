import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementBadgeComponent } from './element-badge.component';

export interface VideoCardModel {
  title: string;
  slug: string;
  thumbnailUrl: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
}

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [RouterLink, ElementBadgeComponent, NgOptimizedImage],
  template: `
    <a [routerLink]="['/videos', slug]" class="card overflow-hidden block group" aria-label="{{ title }}">
      <div class="relative aspect-video bg-slate-200 overflow-hidden">
        <img
          ngSrc="{{ thumbnailUrl }}"
          width="1200"
          height="675"
          alt="{{ title }}"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/60 text-white">▶</span>
        </div>
      </div>
      <div class="p-4">
        <app-element-badge [element]="element" />
        <h3 class="mt-2 font-semibold line-clamp-2">{{ title }}</h3>
      </div>
    </a>
  `,
})
export class VideoCardComponent {
  @Input() title!: string;
  @Input() slug!: string;
  @Input() thumbnailUrl!: string;
  @Input() element!: 'earth' | 'water' | 'fire' | 'air' | 'space';
}
