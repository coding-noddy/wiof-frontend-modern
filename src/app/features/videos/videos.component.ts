import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { VideoCardComponent } from '../../shared/ui/video-card.component';
import { VIDEO_SERVICE } from '../../core/services/tokens';
import { Video } from '../../shared/models/video.model';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [NgFor, NgIf, VideoCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Videos</h1>
        <p class="section-sub mb-6">Watch and share inspiring stories.</p>

        <!-- Loading state -->
        <div *ngIf="loading()" class="text-center py-12">
          <div class="text-slate-600">Loading videos...</div>
        </div>

        <!-- Video grid -->
        <div *ngIf="!loading()" class="space-y-8">
          <!-- Featured videos -->
          <div *ngIf="featuredVideos().length > 0" class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Featured Videos</h2>
            <div class="grid lg:grid-cols-2 gap-8">
              <app-video-card
                *ngFor="let video of featuredVideos()"
                [title]="video.title"
                [slug]="video.id"
                [thumbnailUrl]="video.thumbnailUrl"
                [element]="video.element ?? 'earth'"
              />
            </div>
          </div>

          <!-- All videos -->
          <div>
            <h2 class="text-2xl font-bold mb-6">All Videos</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <app-video-card
                *ngFor="let video of videos()"
                [title]="video.title"
                [slug]="video.id"
                [thumbnailUrl]="video.thumbnailUrl"
                [element]="video.element ?? 'earth'"
              />
            </div>

            <!-- Load more -->
            <div *ngIf="hasMoreVideos()" class="text-center mt-8">
              <button
                class="button button-primary"
                [disabled]="loadingMore()"
                (click)="loadMore()"
              >
                {{ loadingMore() ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class VideosComponent implements OnInit {
  private videoService = inject(VIDEO_SERVICE);

  loading = signal(true);
  loadingMore = signal(false);
  videos = signal<Video[]>([]);
  featuredVideos = signal<Video[]>([]);
  currentPage = signal(1);
  hasMoreVideos = signal(false);
  readonly PAGE_SIZE = 9;

  ngOnInit(): void {
    // Load featured videos (limit to 2)
    this.videoService.getFeaturedVideos(2).subscribe(featured => {
      this.featuredVideos.set(featured);

      // Then load all videos
      this.loadVideos();
    });
  }

  loadVideos(): void {
    this.videoService
      .getVideos(this.currentPage(), this.PAGE_SIZE)
      .subscribe(response => {
        this.videos.set(response.videos);
        this.hasMoreVideos.set(response.hasMore);
        this.loading.set(false);
      });
  }

  loadMore(): void {
    this.loadingMore.set(true);
    this.currentPage.update(page => page + 1);

    this.videoService
      .getVideos(this.currentPage(), this.PAGE_SIZE)
      .subscribe(response => {
        this.videos.update(videos => [...videos, ...response.videos]);
        this.hasMoreVideos.set(response.hasMore);
        this.loadingMore.set(false);
      });
  }
}
