import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';

interface FocusStory {
  id: string;
  title: string;
  description: string;
  type: 'ngo' | 'firm' | 'city' | 'innovation';
  imageUrl: string;
  metrics?: { label: string; value: string }[];
}

@Component({
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, ElementBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">{{ elementName() }} in Focus</h2>
        <p class="text-slate-600">Organizations and innovations making a difference</p>
      </div>

      <!-- Featured Story -->
      <div class="card overflow-hidden">
        <a [routerLink]="['/focus', featuredStory().type, featuredStory().id]" class="block group">
          <div class="aspect-video bg-slate-200 overflow-hidden">
            <img [src]="featuredStory().imageUrl" [alt]="featuredStory().title" 
                 class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <app-element-badge [element]="elementTyped()" />
              <span class="text-xs text-slate-500 capitalize">{{ featuredStory().type }} in Focus</span>
            </div>
            <h3 class="font-semibold text-xl leading-tight mb-3">{{ featuredStory().title }}</h3>
            <p class="text-slate-600 mb-4">{{ featuredStory().description }}</p>
            
            <div *ngIf="featuredStory().metrics" class="grid grid-cols-3 gap-4">
              <div *ngFor="let metric of featuredStory().metrics" class="text-center">
                <div class="font-semibold text-lg" [ngClass]="elementColor()">{{ metric.value }}</div>
                <div class="text-xs text-slate-500">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- Other Stories Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let story of otherStories()" class="card overflow-hidden hover:shadow-md transition">
          <a [routerLink]="['/focus', story.type, story.id]" class="block">
            <div class="aspect-video bg-slate-200 overflow-hidden">
              <img [src]="story.imageUrl" [alt]="story.title" 
                   class="w-full h-full object-cover hover:scale-105 transition duration-300" />
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <app-element-badge [element]="elementTyped()" />
                <span class="text-xs text-slate-500 capitalize">{{ story.type }}</span>
              </div>
              <h4 class="font-medium text-sm leading-tight mb-2">{{ story.title }}</h4>
              <p class="text-xs text-slate-600 line-clamp-2">{{ story.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
})
export class ElementInFocusComponent {
  route = inject(ActivatedRoute);
  
  element = computed(() => this.route.parent?.snapshot.paramMap.get('element') || 'earth');
  elementName = computed(() => this.element().charAt(0).toUpperCase() + this.element().slice(1));
  
  elementTyped = computed(() => this.element() as 'earth' | 'water' | 'fire' | 'air' | 'space');
  
  elementColor() {
    const e = this.element();
    return {
      'text-earth': e === 'earth',
      'text-water': e === 'water',
      'text-fire': e === 'fire', 
      'text-air': e === 'air',
      'text-space': e === 'space'
    };
  }
  
  featuredStory(): FocusStory {
    const featured = {
      earth: {
        id: 'patagonia-earth',
        title: 'Patagonia: Regenerative Agriculture Pioneer',
        description: 'How Patagonia is transforming farming practices to restore soil health and biodiversity.',
        type: 'firm' as const,
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
        metrics: [{ label: 'Farms Supported', value: '150+' }, { label: 'Acres Restored', value: '50K+' }, { label: 'CO2 Captured', value: '2.5M lbs' }]
      },
      water: {
        id: 'ocean-cleanup-water',
        title: 'The Ocean Cleanup: Plastic Removal Innovation',
        description: 'Revolutionary technology removing plastic waste from ocean gyres worldwide.',
        type: 'innovation' as const,
        imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop',
        metrics: [{ label: 'Plastic Removed', value: '100K kg' }, { label: 'Systems Deployed', value: '12' }, { label: 'Oceans Cleaned', value: '3' }]
      },
      fire: {
        id: 'tesla-energy',
        title: 'Tesla: Accelerating Sustainable Energy',
        description: 'Leading the transition to sustainable energy through electric vehicles and solar solutions.',
        type: 'firm' as const,
        imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?q=80&w=1200&auto=format&fit=crop',
        metrics: [{ label: 'EVs Delivered', value: '1.8M+' }, { label: 'CO2 Avoided', value: '13.4M tons' }, { label: 'Solar Deployed', value: '4.2 GW' }]
      },
      air: {
        id: 'copenhagen-air',
        title: 'Copenhagen: Carbon Neutral by 2025',
        description: 'How Denmark\'s capital is leading urban air quality and climate action.',
        type: 'city' as const,
        imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop',
        metrics: [{ label: 'Emissions Cut', value: '50%' }, { label: 'Green Roofs', value: '400+' }, { label: 'Bike Lanes', value: '390 km' }]
      },
      space: {
        id: 'mindfulness-community',
        title: 'Mindful Communities: Collective Consciousness',
        description: 'Building environmental awareness through mindfulness and community connection.',
        type: 'ngo' as const,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
        metrics: [{ label: 'Communities', value: '250+' }, { label: 'Practitioners', value: '15K+' }, { label: 'Countries', value: '45' }]
      }
    };
    return featured[this.element() as keyof typeof featured];
  }
  
  otherStories(): FocusStory[] {
    return [
      {
        id: 'story-1',
        title: 'Local Innovation Initiative',
        description: 'Community-driven solutions for environmental challenges.',
        type: 'innovation',
        imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'story-2', 
        title: 'Green City Project',
        description: 'Urban sustainability transformation in action.',
        type: 'city',
        imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=600&auto=format&fit=crop'
      }
    ];
  }
}
