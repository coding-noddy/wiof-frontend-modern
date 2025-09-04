import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { VideoCardComponent, VideoCardModel } from '../../shared/ui/video-card.component';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [NgFor, VideoCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Videos</h1>
        <p class="section-sub mb-6">Watch and share inspiring stories.</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-video-card
            *ngFor="let v of videos"
            [title]="v.title"
            [slug]="v.slug"
            [thumbnailUrl]="v.thumbnailUrl"
            [element]="v.element"
          />
        </div>
      </div>
    </section>
  `,
})
export class VideosComponent {
  videos: VideoCardModel[] = [
    {
      title: 'Why Water Matters',
      slug: 'why-water-matters',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop',
      element: 'water',
    },
    {
      title: 'Plant a Tree Today',
      slug: 'plant-a-tree',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop',
      element: 'earth',
    },
    {
      title: 'Breath and Balance',
      slug: 'breath-and-balance',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
      element: 'air',
    },
  ];
}
