import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementBadgeComponent } from './element-badge.component';

export interface Widget {
  id: string;
  title: string;
  description: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  currentValue: string;
  unit: string;
  status: 'good' | 'moderate' | 'poor';
  icon: string;
}

@Component({
  selector: 'app-widget-teaser',
  standalone: true,
  imports: [NgFor, RouterLink, ElementBadgeComponent],
  template: `
    <section class="section">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="section-title">Interactive Widgets</h2>
            <p class="section-sub">Real-time environmental data and tools</p>
          </div>
          <a routerLink="/element" class="text-water hover:text-water/80 text-sm font-medium">
            Explore all widgets
          </a>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div *ngFor="let widget of widgets" 
               class="card p-4 hover:shadow-lg transition cursor-pointer group"
               (click)="openWidget(widget.id)">
            <div class="flex items-center justify-between mb-3">
              <div class="text-2xl">{{ widget.icon }}</div>
              <app-element-badge [element]="widget.element" />
            </div>
            
            <h3 class="font-semibold text-sm mb-1">{{ widget.title }}</h3>
            <p class="text-xs text-slate-600 mb-3">{{ widget.description }}</p>
            
            <div class="flex items-end justify-between">
              <div>
                <div class="text-lg font-bold" 
                     [class.text-green-600]="widget.status === 'good'"
                     [class.text-yellow-600]="widget.status === 'moderate'"
                     [class.text-red-600]="widget.status === 'poor'">
                  {{ widget.currentValue }}
                </div>
                <div class="text-xs text-slate-500">{{ widget.unit }}</div>
              </div>
              
              <div class="text-water group-hover:text-water/80 text-xs font-medium">
                Open →
              </div>
            </div>
            
            <!-- Status indicator -->
            <div class="mt-3 flex items-center gap-1">
              <div class="w-2 h-2 rounded-full"
                   [class.bg-green-500]="widget.status === 'good'"
                   [class.bg-yellow-500]="widget.status === 'moderate'"
                   [class.bg-red-500]="widget.status === 'poor'">
              </div>
              <span class="text-xs text-slate-500 capitalize">{{ widget.status }}</span>
            </div>
          </div>
        </div>
        
        <!-- Call to action -->
        <div class="mt-8 text-center">
          <div class="card p-6 bg-gradient-to-r from-water/5 to-space/5 border-water/20">
            <h3 class="font-semibold text-lg mb-2">Calculate Your Impact</h3>
            <p class="text-slate-600 mb-4">Use our interactive tools to measure and improve your environmental footprint</p>
            <a routerLink="/element" 
               class="inline-flex items-center px-6 py-3 rounded-xl bg-water text-white font-medium hover:bg-water/90 transition">
              Start Calculating
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WidgetTeaserComponent {
  widgets: Widget[] = [
    {
      id: 'aqi',
      title: 'Air Quality Index',
      description: 'Current air quality in your area',
      element: 'air',
      currentValue: '42',
      unit: 'AQI',
      status: 'good',
      icon: '🌬️'
    },
    {
      id: 'energy',
      title: 'Energy Calculator',
      description: 'Track your energy consumption',
      element: 'fire',
      currentValue: '2.4',
      unit: 'kWh/day',
      status: 'moderate',
      icon: '⚡'
    },
    {
      id: 'water',
      title: 'Water Usage',
      description: 'Monitor daily water consumption',
      element: 'water',
      currentValue: '180',
      unit: 'L/day',
      status: 'good',
      icon: '💧'
    },
    {
      id: 'ph',
      title: 'Soil pH Meter',
      description: 'Test soil acidity levels',
      element: 'earth',
      currentValue: '6.8',
      unit: 'pH',
      status: 'good',
      icon: '🌱'
    },
    {
      id: 'eq',
      title: 'EQ Assessment',
      description: 'Environmental awareness quiz',
      element: 'space',
      currentValue: '85',
      unit: '%',
      status: 'good',
      icon: '🧠'
    }
  ];

  openWidget(widgetId: string) {
    console.log('Opening widget:', widgetId);
  }
}
