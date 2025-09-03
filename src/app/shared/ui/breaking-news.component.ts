import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  url?: string;
  isExternal?: boolean;
}

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  imports: [NgFor, RouterLink],
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
        <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Featured news item -->
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-semibold text-red-600 uppercase tracking-wide">Breaking</span>
              </div>
              <div>
                <h3 class="font-semibold text-lg leading-tight mb-2">{{ featuredNews.title }}</h3>
                <p class="text-slate-600 text-sm mb-3">{{ featuredNews.excerpt }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500">{{ featuredNews.date }}</span>
                  <a 
                    [href]="featuredNews.url" 
                    [target]="featuredNews.isExternal ? '_blank' : '_self'"
                    class="text-water hover:text-water/80 text-sm font-medium"
                  >
                    Read more →
                  </a>
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
                    <p class="text-xs text-slate-500">{{ item.date }}</p>
                  </div>
                  <a 
                    [href]="item.url" 
                    [target]="item.isExternal ? '_blank' : '_self'"
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
export class BreakingNewsComponent {
  featuredNews: NewsItem = {
    id: '1',
    title: 'Japan\'s Worst Wildfire in 50 years kills 1 person and damages 210 buildings forcing 4200 residents to flee',
    excerpt: 'Japan\'s worst wildfire in more than half a century has killed at least one person and damaged over 200 buildings.',
    date: 'Sat, Mar 08 2025',
    url: 'https://example.com/japan-wildfire',
    isExternal: true
  };

  recentNews: NewsItem[] = [
    {
      id: '2',
      title: 'New Climate Action Plan Announced',
      excerpt: '',
      date: 'Mar 07 2025',
      url: '/blog/climate-action-plan',
      isExternal: false
    },
    {
      id: '3',
      title: 'Ocean Conservation Initiative Launched',
      excerpt: '',
      date: 'Mar 06 2025',
      url: '/blog/ocean-conservation',
      isExternal: false
    },
    {
      id: '4',
      title: 'Renewable Energy Milestone Reached',
      excerpt: '',
      date: 'Mar 05 2025',
      url: '/blog/renewable-energy',
      isExternal: false
    }
  ];
}
