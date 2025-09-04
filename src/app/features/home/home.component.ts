import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementCardComponent } from '../../shared/ui/element-card.component';
import { VideoCardComponent, VideoCardModel } from '../../shared/ui/video-card.component';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { BreakingNewsComponent } from '../../shared/ui/breaking-news.component';
import { WeeklyQuizTeaserComponent } from '../../shared/ui/weekly-quiz-teaser.component';
import { EnvironmentCalendarTeaserComponent } from '../../shared/ui/environment-calendar-teaser.component';
import { InFocusComponent } from '../../shared/ui/in-focus.component';
import { WidgetTeaserComponent } from '../../shared/ui/widget-teaser.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    ElementCardComponent,
    VideoCardComponent,
    BreakingNewsComponent,
    WeeklyQuizTeaserComponent,
    EnvironmentCalendarTeaserComponent,
    InFocusComponent,
    WidgetTeaserComponent
  ],
  template: `
    <!-- Hero -->
    <section class="section pt-12">
      <div class="container grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <p class="text-sm tracking-wide text-water font-semibold">Vasudhaiva Kutumbakam</p>
          <h1 class="text-3xl sm:text-5xl font-bold mt-2 leading-tight">The World is One Family</h1>
          <p class="section-sub max-w-prose">
            A movement to live in harmony with Earth, Water, Fire, Air and Space. Learn, act and
            share for a thriving planet.
          </p>
          <div class="mt-6 flex gap-3">
            <a routerLink="/element" class="px-5 py-3 rounded-xl bg-water text-white shadow-soft"
              >Explore the Elements</a
            >
            <a routerLink="/videos" class="px-5 py-3 rounded-xl border border-slate-300"
              >Watch Our Story</a
            >
          </div>
        </div>
        <div class="relative">
          <div class="aspect-video rounded-2xl bg-gradient-to-tr from-water to-space"></div>
          <div
            class="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-soft p-4 border border-slate-100"
          >
            <div class="text-sm text-slate-600">Live in balance with the Five Elements</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Breaking News -->
    <app-breaking-news />

    <!-- Elements grid -->
    <section class="section">
      <div class="container">
        <div class="flex items-end justify-between mb-6">
          <div>
            <h2 class="section-title">Explore the Five Elements</h2>
            <p class="section-sub">Learn, practice and share by element.</p>
          </div>
          <a routerLink="/element" class="text-water">View all</a>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <app-element-card
            *ngFor="let e of elements"
            [tag]="e.tag"
            [title]="e.title"
            [description]="e.description"
          />
        </div>
      </div>
    </section>

    <!-- Weekly Quiz Teaser -->
    <app-weekly-quiz-teaser />

    <!-- Environment Calendar Teaser -->
    <app-environment-calendar-teaser />

    <!-- Featured videos -->
    <section class="section">
      <div class="container">
        <div class="flex items-end justify-between mb-6">
          <div>
            <h2 class="section-title">Voices & Stories</h2>
            <p class="section-sub">Watch and share inspiring stories.</p>
          </div>
          <a routerLink="/videos" class="text-water">See all</a>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-video-card
            *ngFor="let v of featuredVideos"
            [title]="v.title"
            [slug]="v.slug"
            [thumbnailUrl]="v.thumbnailUrl"
            [element]="v.element"
          />
        </div>
      </div>
    </section>

    <!-- In Focus -->
    <app-in-focus />

    <!-- Interactive Widgets -->
    <app-widget-teaser />

    <!-- In Focus / Campaign CTA -->
    <section class="section">
      <div class="container">
        <div class="card p-6 flex flex-col sm:flex-row items-center gap-6">
          <div class="flex-1">
            <h3 class="text-xl font-semibold">In Focus: Save Water, Save Life</h3>
            <p class="text-slate-600 mt-2">
              Small steps make a big difference. Join our week-long challenge and share your
              actions.
            </p>
          </div>
          <a routerLink="/focus/water" class="px-5 py-3 rounded-xl bg-water text-white"
            >Join the Campaign</a
          >
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="section pb-24">
      <div class="container">
        <div class="card p-8 text-center">
          <h3 class="text-xl font-semibold">Join the family — stay updated</h3>
          <p class="text-slate-600 mt-2">Monthly stories, actions and tools in your inbox.</p>
          <form class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="you@example.com"
              class="w-full sm:w-80 border border-slate-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-water"
            />
            <button class="px-6 py-3 rounded-xl bg-water text-white">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  elements = [
    { tag: 'earth', title: 'Earth', description: 'Soil, food, trees and biodiversity.' },
    { tag: 'water', title: 'Water', description: 'Rivers, oceans, conservation and purity.' },
    { tag: 'fire', title: 'Fire', description: 'Energy, sustainability and balance.' },
    { tag: 'air', title: 'Air', description: 'Clean air, climate and breath.' },
    { tag: 'space', title: 'Space', description: 'Mindfulness, spirit and connection.' },
  ] as { tag: any; title: string; description: string }[];

  featuredVideos: VideoCardModel[] = [
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
