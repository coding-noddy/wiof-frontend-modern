import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NEWS_SERVICE } from '../../core/services/tokens';
import { NewsItem } from '../../core/services/interfaces/news.service.interface';

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="section-title">Breaking News</h2>
            <p class="section-sub">Latest environmental updates and alerts</p>
          </div>
          <a routerLink="/blog" class="text-water hover:text-water/80 text-sm font-medium">
            View all news
          </a>
        </div>

        <!-- News ticker/carousel -->
        <div *ngIf="featuredNews" class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Featured news item -->
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-semibold text-red-600 uppercase tracking-wide">Breaking</span>
              </div>
              <div>
                <h3 class="font-semibold text-lg leading-tight mb-2">{{ featuredNews.title }}</h3>
                <p class="text-slate-600 text-sm mb-3">{{ featuredNews.summary }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500">{{ featuredNews.publishedAt | date:'MMM dd, yyyy' }}</span>
                  <div class="flex items-center gap-1">
                    <span *ngIf="featuredNews.element" class="text-xs px-2 py-1 rounded bg-slate-100">
                      {{ featuredNews.element }}
                    </span>
                    <a
                      [routerLink]="['/news', featuredNews.id]"
                      class="text-water hover:text-water/80 text-sm font-medium"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent news list -->
            <div class="space-y-3">
              <h4 class="font-medium text-slate-700 mb-3">Recent Updates</h4>
              <div class="space-y-3">
                <div *ngFor="let item of recentNews" class="flex gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition">
                  <div class="flex-1">
                    <h5 class="font-medium text-sm leading-tight mb-1">{{ item.title }}</h5>
                    <div class="flex items-center gap-2">
                      <p class="text-xs text-slate-500">{{ item.publishedAt | date:'MMM dd' }}</p>
                      <span *ngIf="item.element" class="text-xs px-1.5 py-0.5 rounded bg-slate-100">
                        {{ item.element }}
                      </span>
                    </div>
                  </div>
                  <a
                    [routerLink]="['/news', item.id]"
                    class="text-water hover:text-water/80 text-xs font-medium self-start"
                  >
                    →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BreakingNewsComponent implements OnInit {
  private readonly newsService = inject(NEWS_SERVICE);

  featuredNews?: NewsItem;
  recentNews: NewsItem[] = [];

  ngOnInit() {
    // Get breaking news
    this.newsService.getBreakingNews().subscribe(news => {
      if (news.length > 0) {
        [this.featuredNews, ...this.recentNews] = news;
        this.recentNews = this.recentNews.slice(0, 3); // Limit to 3 recent news items
      }
    });
  }
}
