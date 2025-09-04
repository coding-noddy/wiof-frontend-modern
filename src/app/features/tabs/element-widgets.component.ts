import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';

interface ElementWidget {
  id: string;
  title: string;
  description: string;
  type: 'calculator' | 'tracker' | 'monitor' | 'quiz';
  icon: string;
  status: 'active' | 'coming-soon';
}

@Component({
  standalone: true,
  imports: [NgFor, NgClass, ElementBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">{{ elementName() }} Widgets & Tools</h2>
        <p class="text-slate-600">Interactive tools to measure and improve your environmental impact</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let widget of elementWidgets()" 
             class="card p-6 hover:shadow-lg transition cursor-pointer"
             [class.opacity-60]="widget.status === 'coming-soon'"
             (click)="openWidget(widget.id)">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">{{ widget.icon }}</div>
            <app-element-badge [element]="elementTyped()" />
          </div>
          
          <h3 class="font-semibold text-lg mb-2">{{ widget.title }}</h3>
          <p class="text-slate-600 text-sm mb-4">{{ widget.description }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-xs px-2 py-1 rounded-full" 
                  [ngClass]="{
                    'bg-green-100 text-green-700': widget.status === 'active',
                    'bg-slate-100 text-slate-600': widget.status === 'coming-soon'
                  }">
              {{ widget.status === 'active' ? 'Available' : 'Coming Soon' }}
            </span>
            <span class="text-xs text-slate-500 capitalize">{{ widget.type }}</span>
          </div>
        </div>
      </div>

      <!-- Featured Widget Section -->
      <div class="card p-8 bg-gradient-to-r" [ngClass]="elementGradientBg()">
        <div class="text-center text-white">
          <h3 class="text-xl font-bold mb-2">{{ featuredWidget().title }}</h3>
          <p class="mb-6 opacity-90">{{ featuredWidget().description }}</p>
          <button class="px-6 py-3 bg-white/20 backdrop-blur rounded-xl font-medium hover:bg-white/30 transition">
            Try {{ featuredWidget().title }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ElementWidgetsComponent {
  route = inject(ActivatedRoute);
  
  element = computed(() => this.route.parent?.snapshot.paramMap.get('element') || 'earth');
  elementName = computed(() => this.element().charAt(0).toUpperCase() + this.element().slice(1));
  
  elementTyped = computed(() => this.element() as 'earth' | 'water' | 'fire' | 'air' | 'space');
  
  elementGradientBg() {
    const e = this.element();
    return {
      'from-earth to-earth/80': e === 'earth',
      'from-water to-water/80': e === 'water',
      'from-fire to-fire/80': e === 'fire',
      'from-air to-air/80': e === 'air', 
      'from-space to-space/80': e === 'space'
    };
  }
  
  elementWidgets() {
    const widgetsByElement = {
      earth: [
        { id: 'soil-ph', title: 'Soil pH Meter', description: 'Test and monitor soil acidity levels', type: 'monitor', icon: '🌱', status: 'active' },
        { id: 'carbon-footprint', title: 'Carbon Calculator', description: 'Calculate your carbon footprint', type: 'calculator', icon: '🌍', status: 'active' },
        { id: 'waste-tracker', title: 'Waste Tracker', description: 'Monitor and reduce waste generation', type: 'tracker', icon: '♻️', status: 'coming-soon' }
      ],
      water: [
        { id: 'water-usage', title: 'Water Usage Calculator', description: 'Track daily water consumption', type: 'calculator', icon: '💧', status: 'active' },
        { id: 'water-quality', title: 'Water Quality Test', description: 'Test water purity and safety', type: 'monitor', icon: '🧪', status: 'active' },
        { id: 'conservation-tips', title: 'Conservation Quiz', description: 'Learn water saving techniques', type: 'quiz', icon: '🚿', status: 'coming-soon' }
      ],
      fire: [
        { id: 'energy-calculator', title: 'Energy Calculator', description: 'Track energy consumption and costs', type: 'calculator', icon: '⚡', status: 'active' },
        { id: 'solar-potential', title: 'Solar Potential', description: 'Calculate solar energy potential', type: 'calculator', icon: '☀️', status: 'active' },
        { id: 'efficiency-tracker', title: 'Efficiency Tracker', description: 'Monitor energy efficiency improvements', type: 'tracker', icon: '📊', status: 'coming-soon' }
      ],
      air: [
        { id: 'aqi-monitor', title: 'Air Quality Monitor', description: 'Real-time air quality tracking', type: 'monitor', icon: '🌬️', status: 'active' },
        { id: 'emissions-calculator', title: 'Emissions Calculator', description: 'Calculate transportation emissions', type: 'calculator', icon: '🚗', status: 'active' },
        { id: 'pollution-tracker', title: 'Pollution Tracker', description: 'Track local pollution sources', type: 'tracker', icon: '🏭', status: 'coming-soon' }
      ],
      space: [
        { id: 'mindfulness-tracker', title: 'Mindfulness Tracker', description: 'Track meditation and mindfulness practice', type: 'tracker', icon: '🧘', status: 'active' },
        { id: 'community-impact', title: 'Community Impact', description: 'Measure collective environmental impact', type: 'calculator', icon: '👥', status: 'active' },
        { id: 'wellness-quiz', title: 'Eco-Wellness Quiz', description: 'Assess environmental wellness', type: 'quiz', icon: '🌟', status: 'coming-soon' }
      ]
    };
    return widgetsByElement[this.element() as keyof typeof widgetsByElement] || [];
  }
  
  featuredWidget() {
    const featured = {
      earth: { title: 'Carbon Footprint Calculator', description: 'Get a comprehensive analysis of your environmental impact' },
      water: { title: 'Water Usage Calculator', description: 'Discover how much water you use and ways to conserve' },
      fire: { title: 'Energy Efficiency Calculator', description: 'Optimize your energy consumption and save money' },
      air: { title: 'Air Quality Monitor', description: 'Stay informed about air quality in your area' },
      space: { title: 'Community Impact Calculator', description: 'See how your actions contribute to collective change' }
    };
    return featured[this.element() as keyof typeof featured];
  }
  
  openWidget(widgetId: string) {
    console.log('Opening widget:', widgetId);
  }
}
