import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';

interface Action {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeNeeded: string;
  impactScore: number;
  category: string;
  checklist: string[];
}

@Component({
  standalone: true,
  imports: [NgFor, NgClass, NgIf, RouterLink, ElementBadgeComponent, TitleCasePipe],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">Take Action for {{ elementName() }}</h2>
        <p class="text-slate-600">Practical steps to make a positive impact</p>
      </div>

      <!-- Filter by difficulty -->
      <div class="flex justify-center gap-2">
        <button *ngFor="let diff of difficulties" 
                (click)="selectedDifficulty = diff"
                class="px-4 py-2 rounded-xl text-sm transition"
                [ngClass]="{
                  'bg-slate-900 text-white': selectedDifficulty === diff,
                  'border border-slate-300 hover:bg-slate-50': selectedDifficulty !== diff
                }">
          {{ diff | titlecase }}
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let action of filteredActions()" class="card p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <app-element-badge [element]="elementTyped()" />
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-1 rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-700': action.difficulty === 'easy',
                      'bg-yellow-100 text-yellow-700': action.difficulty === 'medium', 
                      'bg-red-100 text-red-700': action.difficulty === 'hard'
                    }">
                {{ action.difficulty }}
              </span>
              <span class="text-xs text-slate-500">{{ action.timeNeeded }}</span>
            </div>
          </div>
          
          <h3 class="font-semibold text-lg mb-2">{{ action.title }}</h3>
          <p class="text-slate-600 text-sm mb-4">{{ action.description }}</p>
          
          <!-- Impact Score -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-slate-600">Impact Score</span>
              <span class="font-medium">{{ action.impactScore }}/100</span>
            </div>
            <div class="bg-slate-200 rounded-full h-2 overflow-hidden">
              <div class="h-full transition-all duration-500" 
                   [style.width.%]="action.impactScore"
                   [ngClass]="elementColor()"></div>
            </div>
          </div>
          
          <!-- Checklist Preview -->
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2">Action Steps:</h4>
            <ul class="text-xs text-slate-600 space-y-1">
              <li *ngFor="let step of action.checklist.slice(0, 3)" class="flex items-start gap-2">
                <span class="text-slate-400">•</span>
                <span>{{ step }}</span>
              </li>
              <li *ngIf="action.checklist.length > 3" class="text-slate-400">
                +{{ action.checklist.length - 3 }} more steps
              </li>
            </ul>
          </div>
          
          <button class="w-full px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition text-sm font-medium">
            Start This Action
          </button>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <a routerLink="/take-action" 
           class="inline-flex items-center px-6 py-3 rounded-xl text-white font-medium transition"
           [ngClass]="elementBgColor()">
          View All {{ elementName() }} Actions
        </a>
      </div>
    </div>
  `
})
export class ElementTakeActionComponent {
  route = inject(ActivatedRoute);
  selectedDifficulty: string = 'all';
  difficulties = ['all', 'easy', 'medium', 'hard'];
  
  element = computed(() => this.route.parent?.snapshot.paramMap.get('element') || 'earth');
  elementName = computed(() => this.element().charAt(0).toUpperCase() + this.element().slice(1));
  
  elementTyped = computed(() => this.element() as 'earth' | 'water' | 'fire' | 'air' | 'space');
  
  elementColor() {
    const e = this.element();
    return {
      'bg-earth': e === 'earth',
      'bg-water': e === 'water',
      'bg-fire': e === 'fire',
      'bg-air': e === 'air', 
      'bg-space': e === 'space'
    };
  }
  
  elementBgColor() {
    const e = this.element();
    return {
      'bg-earth hover:bg-earth/90': e === 'earth',
      'bg-water hover:bg-water/90': e === 'water',
      'bg-fire hover:bg-fire/90': e === 'fire',
      'bg-air hover:bg-air/90': e === 'air',
      'bg-space hover:bg-space/90': e === 'space'
    };
  }
  
  elementActions(): Action[] {
    const element = this.element();
    return [
      {
        id: `${element}-action-1`,
        title: `${this.elementName()} Conservation Challenge`,
        description: `Start your ${element} conservation journey with simple daily actions.`,
        difficulty: 'easy',
        timeNeeded: '5 min/day',
        impactScore: 75,
        category: 'conservation',
        checklist: ['Track daily usage', 'Set reduction goals', 'Monitor progress', 'Share results']
      },
      {
        id: `${element}-action-2`, 
        title: `Community ${this.elementName()} Project`,
        description: `Organize a local initiative to protect ${element} resources.`,
        difficulty: 'medium',
        timeNeeded: '2-3 hours',
        impactScore: 90,
        category: 'community',
        checklist: ['Find local partners', 'Plan activities', 'Execute project', 'Measure impact', 'Share learnings']
      },
      {
        id: `${element}-action-3`,
        title: `Advanced ${this.elementName()} Research`,
        description: `Contribute to scientific research and data collection efforts.`,
        difficulty: 'hard',
        timeNeeded: '1-2 weeks',
        impactScore: 95,
        category: 'research',
        checklist: ['Join research program', 'Complete training', 'Collect data', 'Analyze results', 'Publish findings', 'Mentor others']
      }
    ];
  }
  
  filteredActions(): Action[] {
    const actions = this.elementActions();
    if (this.selectedDifficulty === 'all') {
      return actions;
    }
    return actions.filter(action => action.difficulty === this.selectedDifficulty);
  }
}
