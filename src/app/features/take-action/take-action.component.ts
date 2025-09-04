import { Component, computed, signal } from '@angular/core';
import { NgFor, NgIf, NgClass, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { ActionItem, ActionProgress } from '../../shared/models/action.model';

@Component({
  selector: 'app-take-action',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, FormsModule, ElementBadgeComponent, TitleCasePipe],
  template: `
    <section class="section">
      <div class="container">
        <div class="text-center mb-8">
          <h1 class="section-title">Take Action for the Planet</h1>
          <p class="section-sub">Join thousands making a difference through meaningful environmental actions</p>
        </div>

        <!-- Stats -->
        <div class="grid sm:grid-cols-3 gap-6 mb-8">
          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-water mb-2">{{ getTotalActions() }}</div>
            <div class="text-slate-600">Available Actions</div>
          </div>
          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-water mb-2">{{ getCompletedActions() }}</div>
            <div class="text-slate-600">Actions Completed</div>
          </div>
          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-water mb-2">{{ getPledgedActions() }}</div>
            <div class="text-slate-600">Actions Pledged</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card p-6 mb-8">
          <div class="grid md:grid-cols-4 gap-4">
            <select
              [(ngModel)]="selectedElement"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Elements</option>
              <option value="earth">Earth</option>
              <option value="water">Water</option>
              <option value="fire">Fire</option>
              <option value="air">Air</option>
              <option value="space">Space</option>
            </select>
            
            <select
              [(ngModel)]="selectedDifficulty"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select
              [(ngModel)]="selectedCategory"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Categories</option>
              <option value="conservation">Conservation</option>
              <option value="energy">Energy</option>
              <option value="waste">Waste Reduction</option>
              <option value="transport">Transportation</option>
              <option value="community">Community</option>
            </select>
            
            <select
              [(ngModel)]="selectedTime"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">Any Time</option>
              <option value="quick">Quick (< 30 min)</option>
              <option value="medium">Medium (30 min - 2 hrs)</option>
              <option value="long">Long (> 2 hrs)</option>
            </select>
          </div>
        </div>

        <!-- Action Cards -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div *ngFor="let action of filteredActions()" class="card p-6 hover:shadow-lg transition">
            <div class="flex items-center justify-between mb-4">
              <app-element-badge [element]="action.element" />
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-700': action.difficulty === 'easy',
                        'bg-yellow-100 text-yellow-700': action.difficulty === 'medium',
                        'bg-red-100 text-red-700': action.difficulty === 'hard'
                      }">
                  {{ action.difficulty | titlecase }}
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
                     [ngClass]="getElementBgClass(action.element)"></div>
              </div>
            </div>
            
            <!-- Progress -->
            <div *ngIf="getActionProgress(action.id)" class="mb-4">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-slate-600">Your Progress</span>
                <span class="font-medium">{{ getProgressPercentage(action.id) }}%</span>
              </div>
              <div class="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div class="bg-green-500 h-full transition-all duration-500" 
                     [style.width.%]="getProgressPercentage(action.id)"></div>
              </div>
            </div>
            
            <!-- Checklist Preview -->
            <div class="mb-4">
              <h4 class="text-sm font-medium mb-2">Action Steps:</h4>
              <ul class="text-xs text-slate-600 space-y-1">
                <li *ngFor="let step of action.checklist.slice(0, 3); let i = index" 
                    class="flex items-start gap-2">
                  <span class="text-slate-400">{{ i + 1 }}.</span>
                  <span [ngClass]="{
                    'line-through text-green-600': isStepCompleted(action.id, i),
                    'text-slate-600': !isStepCompleted(action.id, i)
                  }">{{ step }}</span>
                </li>
                <li *ngIf="action.checklist.length > 3" class="text-slate-400">
                  +{{ action.checklist.length - 3 }} more steps
                </li>
              </ul>
            </div>
            
            <!-- Completion Stats -->
            <div class="text-xs text-slate-500 mb-4">
              {{ action.completedBy || 0 }} people have completed this action
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button 
                *ngIf="!getActionProgress(action.id)"
                (click)="startAction(action.id)"
                class="flex-1 px-4 py-2 rounded-xl text-white font-medium transition"
                [ngClass]="getElementBgClass(action.element)"
              >
                Start Action
              </button>
              <button 
                *ngIf="getActionProgress(action.id) && !isActionCompleted(action.id)"
                (click)="continueAction(action.id)"
                class="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                Continue
              </button>
              <button 
                *ngIf="isActionCompleted(action.id)"
                class="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white font-medium cursor-default"
              >
                ✓ Completed
              </button>
              <button 
                *ngIf="!isPledged(action.id)"
                (click)="pledgeAction(action.id)"
                class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition text-sm"
              >
                Pledge
              </button>
              <button 
                *ngIf="isPledged(action.id)"
                class="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm cursor-default"
              >
                Pledged
              </button>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center">
          <div class="card p-8">
            <h2 class="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p class="text-slate-600 mb-6">
              Every action counts. Start with small steps and build momentum for bigger changes.
            </p>
            <div class="flex justify-center gap-4">
              <button 
                (click)="scrollToTop()"
                class="px-6 py-3 rounded-xl bg-water text-white font-medium hover:bg-water/90 transition"
              >
                Browse More Actions
              </button>
              <a routerLink="/quiz" 
                 class="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition font-medium">
                Test Your Knowledge
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TakeActionComponent {
  selectedElement = '';
  selectedDifficulty = '';
  selectedCategory = '';
  selectedTime = '';

  userProgress = signal<ActionProgress[]>([
    { actionId: 'earth-1', completedSteps: [0, 1], startedAt: '2025-09-01', pledged: true },
    { actionId: 'water-2', completedSteps: [0, 1, 2, 3], startedAt: '2025-08-28', completedAt: '2025-09-02', pledged: true },
    { actionId: 'fire-1', completedSteps: [], startedAt: '2025-09-03', pledged: false }
  ]);

  allActions = signal<ActionItem[]>([
    {
      id: 'earth-1',
      title: 'Start Composting at Home',
      description: 'Reduce food waste and create nutrient-rich soil for your garden.',
      difficulty: 'easy',
      timeNeeded: '30 min setup',
      impactScore: 75,
      category: 'waste',
      element: 'earth',
      checklist: [
        'Choose a composting method (bin, tumbler, or pile)',
        'Gather brown materials (leaves, paper, cardboard)',
        'Collect green materials (food scraps, grass clippings)',
        'Set up your composting system',
        'Start adding materials in proper ratios',
        'Monitor and turn regularly'
      ],
      completedBy: 1247
    },
    {
      id: 'water-1',
      title: 'Install Water-Saving Devices',
      description: 'Reduce water consumption with simple, effective devices.',
      difficulty: 'easy',
      timeNeeded: '1 hour',
      impactScore: 65,
      category: 'conservation',
      element: 'water',
      checklist: [
        'Purchase low-flow showerheads and faucet aerators',
        'Install toilet tank displacement devices',
        'Fix any leaky faucets or pipes',
        'Set up rain collection system',
        'Monitor water usage for one month'
      ],
      completedBy: 892
    },
    {
      id: 'water-2',
      title: 'Organize Beach Cleanup',
      description: 'Rally your community to protect marine ecosystems.',
      difficulty: 'medium',
      timeNeeded: '4 hours',
      impactScore: 90,
      category: 'community',
      element: 'water',
      checklist: [
        'Choose a beach location and get permits',
        'Recruit volunteers through social media',
        'Gather cleanup supplies and safety equipment',
        'Conduct the cleanup event',
        'Document and report collected waste data'
      ],
      completedBy: 156
    },
    {
      id: 'fire-1',
      title: 'Switch to Renewable Energy',
      description: 'Transition your home to clean, renewable energy sources.',
      difficulty: 'hard',
      timeNeeded: '2-4 weeks',
      impactScore: 95,
      category: 'energy',
      element: 'fire',
      checklist: [
        'Assess your current energy usage',
        'Research renewable energy providers',
        'Get quotes for solar panel installation',
        'Apply for government incentives',
        'Schedule installation',
        'Monitor energy production and savings'
      ],
      completedBy: 78
    },
    {
      id: 'air-1',
      title: 'Use Public Transportation',
      description: 'Reduce air pollution by choosing sustainable transport options.',
      difficulty: 'easy',
      timeNeeded: 'Daily habit',
      impactScore: 70,
      category: 'transport',
      element: 'air',
      checklist: [
        'Research public transport routes in your area',
        'Purchase monthly transit passes',
        'Plan your commute using public transport',
        'Track your carbon footprint reduction',
        'Encourage others to join you'
      ],
      completedBy: 2341
    },
    {
      id: 'space-1',
      title: 'Practice Mindful Consumption',
      description: 'Develop awareness of your consumption patterns and their impact.',
      difficulty: 'medium',
      timeNeeded: 'Ongoing',
      impactScore: 80,
      category: 'community',
      element: 'space',
      checklist: [
        'Track your purchases for one week',
        'Identify unnecessary consumption patterns',
        'Research sustainable alternatives',
        'Implement a "buy nothing" day weekly',
        'Share your experience with others',
        'Create a sustainable shopping plan'
      ],
      completedBy: 567
    }
  ]);

  filteredActions = computed(() => {
    let actions = this.allActions();
    
    if (this.selectedElement) {
      actions = actions.filter(action => action.element === this.selectedElement);
    }
    
    if (this.selectedDifficulty) {
      actions = actions.filter(action => action.difficulty === this.selectedDifficulty);
    }
    
    if (this.selectedCategory) {
      actions = actions.filter(action => action.category === this.selectedCategory);
    }
    
    if (this.selectedTime) {
      actions = actions.filter(action => {
        const time = action.timeNeeded.toLowerCase();
        switch (this.selectedTime) {
          case 'quick': return time.includes('min') && !time.includes('hour');
          case 'medium': return time.includes('hour') || time.includes('1-2');
          case 'long': return time.includes('week') || time.includes('day');
          default: return true;
        }
      });
    }
    
    return actions;
  });

  updateFilters() {
  }

  getTotalActions(): number {
    return this.allActions().length;
  }

  getCompletedActions(): number {
    return this.userProgress().filter(p => p.completedAt).length;
  }

  getPledgedActions(): number {
    return this.userProgress().filter(p => p.pledged).length;
  }

  getActionProgress(actionId: string): ActionProgress | undefined {
    return this.userProgress().find(p => p.actionId === actionId);
  }

  getProgressPercentage(actionId: string): number {
    const progress = this.getActionProgress(actionId);
    const action = this.allActions().find(a => a.id === actionId);
    if (!progress || !action) return 0;
    
    return Math.round((progress.completedSteps.length / action.checklist.length) * 100);
  }

  isStepCompleted(actionId: string, stepIndex: number): boolean {
    const progress = this.getActionProgress(actionId);
    return progress ? progress.completedSteps.includes(stepIndex) : false;
  }

  isActionCompleted(actionId: string): boolean {
    const progress = this.getActionProgress(actionId);
    return progress ? !!progress.completedAt : false;
  }

  isPledged(actionId: string): boolean {
    const progress = this.getActionProgress(actionId);
    return progress ? progress.pledged : false;
  }

  startAction(actionId: string) {
    const newProgress: ActionProgress = {
      actionId,
      completedSteps: [],
      startedAt: new Date().toISOString().split('T')[0],
      pledged: false
    };
    
    this.userProgress.update(progress => [...progress, newProgress]);
  }

  continueAction(actionId: string) {
    console.log('Continue action:', actionId);
  }

  pledgeAction(actionId: string) {
    this.userProgress.update(progress => 
      progress.map(p => 
        p.actionId === actionId ? { ...p, pledged: true } : p
      )
    );
  }

  getElementBgClass(element: string): string {
    const classes = {
      earth: 'bg-earth hover:bg-earth/90',
      water: 'bg-water hover:bg-water/90',
      fire: 'bg-fire hover:bg-fire/90',
      air: 'bg-air hover:bg-air/90',
      space: 'bg-space hover:bg-space/90'
    };
    return classes[element as keyof typeof classes] || 'bg-slate-600 hover:bg-slate-700';
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
