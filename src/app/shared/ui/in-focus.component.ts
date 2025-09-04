import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementBadgeComponent } from './element-badge.component';

export interface FocusStory {
  id: string;
  title: string;
  description: string;
  type: 'ngo' | 'firm' | 'city' | 'innovation' | 'course';
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  imageUrl: string;
  metrics?: {
    label: string;
    value: string;
  }[];
  featured?: boolean;
}

@Component({
  selector: 'app-in-focus',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, ElementBadgeComponent],
  template: `
    <section class="section">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="section-title">In Focus</h2>
            <p class="section-sub">Spotlighting changemakers and innovations</p>
          </div>
          <a routerLink="/focus/all" class="text-water hover:text-water/80 text-sm font-medium">
            View all stories
          </a>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Featured story (large) -->
          <div class="lg:col-span-2">
            <a 
              [routerLink]="['/focus', featuredStory.type, featuredStory.id]"
              class="card overflow-hidden block group hover:shadow-lg transition"
            >
              <div class="aspect-video bg-slate-200 overflow-hidden">
                <img
                  [src]="featuredStory.imageUrl"
                  [alt]="featuredStory.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 mb-3">
                  <app-element-badge [element]="featuredStory.element" />
                  <span class="text-xs text-slate-500 capitalize">{{ featuredStory.type }} in Focus</span>
                </div>
                <h3 class="font-semibold text-xl leading-tight mb-3">{{ featuredStory.title }}</h3>
                <p class="text-slate-600 mb-4">{{ featuredStory.description }}</p>
                
                <!-- Metrics -->
                <div *ngIf="featuredStory.metrics" class="grid grid-cols-3 gap-4">
                  <div *ngFor="let metric of featuredStory.metrics" class="text-center">
                    <div class="font-semibold text-lg text-water">{{ metric.value }}</div>
                    <div class="text-xs text-slate-500">{{ metric.label }}</div>
                  </div>
                </div>
              </div>
            </a>
          </div>
          
          <!-- Secondary stories (small) -->
          <div class="space-y-4">
            <div *ngFor="let story of secondaryStories" 
                 class="card overflow-hidden hover:shadow-md transition">
              <a [routerLink]="['/focus', story.type, story.id]" class="block">
                <div class="aspect-video bg-slate-200 overflow-hidden">
                  <img
                    [src]="story.imageUrl"
                    [alt]="story.title"
                    class="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <app-element-badge [element]="story.element" />
                    <span class="text-xs text-slate-500 capitalize">{{ story.type }}</span>
                  </div>
                  <h4 class="font-medium text-sm leading-tight mb-2">{{ story.title }}</h4>
                  <p class="text-xs text-slate-600 line-clamp-2">{{ story.description }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class InFocusComponent {
  featuredStory: FocusStory = {
    id: 'patagonia-1-percent',
    title: 'Patagonia: 1% for the Planet Pioneer',
    description: 'How Patagonia revolutionized corporate environmental responsibility by donating 1% of sales to environmental causes, inspiring thousands of companies worldwide.',
    type: 'firm',
    element: 'earth',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
    metrics: [
      { label: 'Donated', value: '$140M+' },
      { label: 'Companies', value: '5,000+' },
      { label: 'Countries', value: '80+' }
    ],
    featured: true
  };

  secondaryStories: FocusStory[] = [
    {
      id: 'ocean-cleanup',
      title: 'The Ocean Cleanup Project',
      description: 'Revolutionary technology removing plastic from ocean gyres.',
      type: 'innovation',
      element: 'water',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'copenhagen-carbon-neutral',
      title: 'Copenhagen: Carbon Neutral by 2025',
      description: 'How Denmark\'s capital is leading urban sustainability.',
      type: 'city',
      element: 'air',
      imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=600&auto=format&fit=crop'
    }
  ];
}
