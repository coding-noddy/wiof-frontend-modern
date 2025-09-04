import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgClass, NgFor],
  template: `
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="text-center">
        <div class="w-24 h-24 rounded-3xl mx-auto mb-6" [ngClass]="elementGradient()"></div>
        <h2 class="text-3xl font-bold mb-4" [ngClass]="elementColor()">{{ elementName() }}</h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">{{ elementDescription() }}</p>
      </div>

      <!-- KPI Chips -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let kpi of elementKPIs()" class="card p-4 text-center">
          <div class="text-2xl font-bold" [ngClass]="elementColor()">{{ kpi.value }}</div>
          <div class="text-sm text-slate-600">{{ kpi.label }}</div>
        </div>
      </div>

      <!-- Element Focus Areas -->
      <div class="card p-6">
        <h3 class="font-semibold text-xl mb-4">Focus Areas</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <div *ngFor="let area of focusAreas()" class="flex items-start gap-3">
            <div class="text-2xl">{{ area.icon }}</div>
            <div>
              <h4 class="font-medium">{{ area.title }}</h4>
              <p class="text-sm text-slate-600">{{ area.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ElementOverviewComponent {
  route = inject(ActivatedRoute);
  
  element = computed(() => this.route.parent?.snapshot.paramMap.get('element') || 'earth');
  elementName = computed(() => this.element().charAt(0).toUpperCase() + this.element().slice(1));
  
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
  
  elementGradient() {
    const e = this.element();
    return {
      'bg-gradient-to-br from-earth to-earth/70': e === 'earth',
      'bg-gradient-to-br from-water to-water/70': e === 'water',
      'bg-gradient-to-br from-fire to-fire/70': e === 'fire', 
      'bg-gradient-to-br from-air to-air/70': e === 'air',
      'bg-gradient-to-br from-space to-space/70': e === 'space'
    };
  }
  
  elementDescription() {
    const descriptions = {
      earth: "Explore sustainable practices for our planet's soil, forests, and biodiversity.",
      water: 'Discover solutions for clean water access, conservation, and marine protection.',
      fire: 'Learn about renewable energy, climate action, and sustainable power solutions.',
      air: 'Understand air quality, atmospheric health, and pollution reduction strategies.',
      space: 'Connect with mindfulness, community spirit, and holistic environmental awareness.'
    };
    return descriptions[this.element() as keyof typeof descriptions];
  }
  
  elementKPIs() {
    return [
      { label: 'Active Projects', value: '24' },
      { label: 'Community Members', value: '1.2K' },
      { label: 'Impact Score', value: '85%' },
      { label: 'Resources', value: '156' }
    ];
  }
  
  focusAreas() {
    return [
      { icon: '🌿', title: 'Conservation', description: 'Protecting natural resources' },
      { icon: '♻️', title: 'Sustainability', description: 'Circular economy practices' },
      { icon: '💡', title: 'Innovation', description: 'Green technology solutions' },
      { icon: '🤝', title: 'Community', description: 'Collective action initiatives' }
    ];
  }
}

