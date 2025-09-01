import { Component, Input } from '@angular/core';
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
  imports: [RouterLink, ElementBadgeComponent],
  template: `
    <a [routerLink]="['/videos', slug]" class="card overflow-hidden block group">
      <div class="aspect-video bg-slate-200 overflow-hidden">
        <img
          [src]="thumbnailUrl"
          alt=""
          class="w-full h-full object-cover group-hover:scale-105 transition"
        />
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
