import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';

interface Voice {
  id: string;
  title: string;
  speaker: string;
  role: string;
  duration: string;
  thumbnailUrl: string;
  summary: string;
}

@Component({
  standalone: true,
  imports: [NgFor, RouterLink, ElementBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">{{ elementName() }} Voices</h2>
        <p class="text-slate-600">Coffee conversations and community insights</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let voice of elementVoices()" class="card overflow-hidden hover:shadow-md transition">
          <a [routerLink]="['/conversations', voice.id]" class="block group">
            <div class="aspect-video bg-slate-200 overflow-hidden relative">
              <img [src]="voice.thumbnailUrl" [alt]="voice.title" 
                   class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-slate-700 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                </div>
              </div>
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ voice.duration }}
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <app-element-badge [element]="elementTyped()" />
                <span class="text-xs text-slate-500">Coffee Conversation</span>
              </div>
              <h3 class="font-medium leading-tight mb-2">{{ voice.title }}</h3>
              <div class="text-sm text-slate-600 mb-2">
                <span class="font-medium">{{ voice.speaker }}</span>
                <span class="text-slate-400"> • {{ voice.role }}</span>
              </div>
              <p class="text-xs text-slate-600 line-clamp-2">{{ voice.summary }}</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center">
        <button class="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition">
          Load More Conversations
        </button>
      </div>
    </div>
  `
})
export class ElementVoicesComponent {
  route = inject(ActivatedRoute);
  
  element = computed(() => this.route.parent?.snapshot.paramMap.get('element') || 'earth');
  elementName = computed(() => this.element().charAt(0).toUpperCase() + this.element().slice(1));
  
  elementTyped = computed(() => this.element() as 'earth' | 'water' | 'fire' | 'air' | 'space');
  
  elementVoices(): Voice[] {
    const element = this.element();
    return Array.from({length: 6}, (_, i) => ({
      id: `${element}-voice-${i+1}`,
      title: `${this.elementName()} Conservation Strategies`,
      speaker: `Expert ${i+1}`,
      role: 'Environmental Scientist',
      duration: `${12 + i}:${30 + i*5}`,
      thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + i*1000000}?q=80&w=600&auto=format&fit=crop`,
      summary: `Insights on ${element} conservation and sustainable practices for communities.`
    }));
  }
}
