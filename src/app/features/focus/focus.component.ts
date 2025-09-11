import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf, NgClass, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { FocusItem, FocusFilter } from '../../shared/models/focus.model';

@Component({
  selector: 'app-focus',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, FormsModule, ElementBadgeComponent, TitleCasePipe],
  template: `
    <section class="section">
      <div class="container">
        <div class="text-center mb-8">
          <h1 class="section-title">{{ getPageTitle() }}</h1>
          <p class="section-sub">{{ getPageDescription() }}</p>
        </div>

        <!-- Filters -->
        <div class="card p-6 mb-8">
          <div class="grid md:grid-cols-3 gap-4">
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
              *ngIf="focusType() === 'all'"
              [(ngModel)]="selectedType"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Types</option>
              <option value="ngo">NGOs</option>
              <option value="firm">Companies</option>
              <option value="city">Cities</option>
              <option value="innovation">Innovations</option>
              <option value="course">Courses</option>
            </select>
            
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                [(ngModel)]="showFeaturedOnly"
                (change)="updateFilters()"
                class="rounded border-slate-300 text-water focus:ring-water"
              />
              <label for="featured" class="text-sm font-medium">Featured only</label>
            </div>
          </div>
        </div>

        <!-- Featured Items -->
        <div *ngIf="featuredItems().length > 0" class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Featured {{ getTypeLabel() }}</h2>
          <div class="grid lg:grid-cols-2 gap-8">
            <div *ngFor="let item of featuredItems()" class="card overflow-hidden hover:shadow-lg transition" tabindex="0" role="link" (click)="openItem(item)" (keyup.enter)="openItem(item)">
              <div class="aspect-video bg-slate-200 overflow-hidden">
                <img [src]="item.imageUrl" [alt]="item.title" 
                     class="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                  <app-element-badge [element]="item.element" />
                  <span class="text-sm px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {{ item.type | titlecase }}
                  </span>
                  <span *ngIf="item.location" class="text-sm text-slate-500">ðŸ“ {{ item.location }}</span>
                </div>
                <h3 class="font-semibold text-xl leading-tight mb-3">{{ item.title }}</h3>
                <p class="text-slate-600 mb-4">{{ item.description }}</p>
                
                <!-- Metrics -->
                <div *ngIf="item.metrics" class="grid grid-cols-3 gap-4 mb-4">
                  <div *ngFor="let metric of item.metrics" class="text-center">
                    <div class="font-semibold text-lg text-water">{{ metric.value }}</div>
                    <div class="text-xs text-slate-500">{{ metric.label }}</div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div *ngIf="item.actions" class="mb-4">
                  <h4 class="text-sm font-medium mb-2">Key Actions:</h4>
                  <ul class="text-sm text-slate-600 space-y-1">
                    <li *ngFor="let action of item.actions.slice(0, 3)" class="flex items-start gap-2">
                      <span class="text-water">â€¢</span>
                      <span>{{ action }}</span>
                    </li>
                  </ul>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-sm text-slate-500">
                    <span *ngIf="item.founded">Founded {{ item.founded }}</span>
                  </div>
                  <div class="flex gap-2">
                    <a *ngIf="item.website" 
                       [href]="item.website" 
                       target="_blank"
                       class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition text-sm">
                      Visit Website
                    </a>
                    <button class="px-4 py-2 rounded-xl bg-water text-white text-sm font-medium hover:bg-water/90 transition">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Items Grid -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">All {{ getTypeLabel() }}</h2>
            <div class="text-sm text-slate-600">{{ filteredItems().length }} results</div>
          </div>
          
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let item of paginatedItems()" class="card overflow-hidden hover:shadow-md transition" tabindex="0" role="link" (click)="openItem(item)" (keyup.enter)="openItem(item)">
              <div class="aspect-video bg-slate-200 overflow-hidden">
                <img [src]="item.imageUrl" [alt]="item.title" 
                     class="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy" />
              </div>
              <div class="p-4">
                <div class="flex items-center gap-2 mb-2">
                  <app-element-badge [element]="item.element" />
                  <span class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {{ item.type | titlecase }}
                  </span>
                </div>
                <h3 class="font-semibold leading-tight mb-2">{{ item.title }}</h3>
                <p class="text-slate-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
                
                <div class="flex items-center justify-between text-xs">
                  <span *ngIf="item.location" class="text-slate-500">ðŸ“ {{ item.location }}</span>
                  <div class="flex gap-1">
                    <a *ngIf="item.website" 
                       [href]="item.website" 
                       target="_blank"
                       class="text-water hover:text-water/80">
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="totalPages() > 1" class="flex items-center justify-center gap-2">
          <button 
            (click)="previousPage()" 
            [disabled]="currentPage() === 1"
            class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <div class="flex items-center gap-1">
            <span *ngFor="let page of pageNumbers()" 
                  (click)="goToPage(page)"
                  class="px-3 py-2 rounded-xl cursor-pointer transition"
                  [ngClass]="{
                    'bg-water text-white': page === currentPage(),
                    'hover:bg-slate-100': page !== currentPage()
                  }">
              {{ page }}
            </span>
          </div>
          <button 
            (click)="nextPage()" 
            [disabled]="currentPage() === totalPages()"
            class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredItems().length === 0" class="text-center py-12">
          <div class="text-slate-400 text-6xl mb-4">ðŸ”</div>
          <h3 class="text-xl font-semibold text-slate-600 mb-2">No results found</h3>
          <p class="text-slate-500">Try adjusting your filters to see more items.</p>
        </div>
      </div>
    </section>
  `,
})
export class FocusComponent {
  route = inject(ActivatedRoute);
  
  selectedElement = '';
  selectedType = '';
  showFeaturedOnly = false;
  currentPage = signal(1);
  pageSize = 9;

  focusType = computed(() => this.route.snapshot.paramMap.get('type') || 'all');

  allItems = signal<FocusItem[]>([
    {
      id: 'patagonia',
      title: 'Patagonia: 1% for the Planet Pioneer',
      description: 'Outdoor clothing company leading corporate environmental responsibility through sustainable practices and activism.',
      type: 'firm',
      element: 'earth',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
      website: 'https://patagonia.com',
      location: 'Ventura, California',
      founded: '1973',
      metrics: [
        { label: 'Donated', value: '$140M+' },
        { label: 'Companies Inspired', value: '5,000+' },
        { label: 'Countries', value: '80+' }
      ],
      actions: [
        'Donate 1% of sales to environmental causes',
        'Use recycled and organic materials',
        'Repair and reuse program',
        'Environmental activism campaigns'
      ],
      featured: true
    },
    {
      id: 'ocean-cleanup',
      title: 'The Ocean Cleanup',
      description: 'Developing advanced technologies to rid the oceans of plastic pollution.',
      type: 'innovation',
      element: 'water',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop',
      website: 'https://theoceancleanup.com',
      location: 'Netherlands',
      founded: '2013',
      metrics: [
        { label: 'Plastic Removed', value: '100K kg' },
        { label: 'Systems Deployed', value: '12' },
        { label: 'Oceans Cleaned', value: '3' }
      ],
      actions: [
        'Deploy ocean cleanup systems',
        'Develop river cleanup technology',
        'Research plastic pollution sources',
        'Partner with governments and NGOs'
      ],
      featured: true
    },
    {
      id: 'copenhagen',
      title: 'Copenhagen: Carbon Neutral Capital',
      description: 'Danish capital leading urban sustainability with ambitious climate goals.',
      type: 'city',
      element: 'air',
      imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop',
      website: 'https://international.kk.dk',
      location: 'Denmark',
      founded: '1167',
      metrics: [
        { label: 'Emissions Cut', value: '50%' },
        { label: 'Green Roofs', value: '400+' },
        { label: 'Bike Lanes', value: '390 km' }
      ],
      actions: [
        'Expand renewable energy infrastructure',
        'Promote cycling and public transport',
        'Implement green building standards',
        'Create urban green spaces'
      ],
      featured: true
    },
    {
      id: 'tesla',
      title: 'Tesla: Accelerating Sustainable Transport',
      description: 'Electric vehicle and clean energy company transforming transportation.',
      type: 'firm',
      element: 'fire',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?q=80&w=1200&auto=format&fit=crop',
      website: 'https://tesla.com',
      location: 'Austin, Texas',
      founded: '2003',
      metrics: [
        { label: 'EVs Delivered', value: '1.8M+' },
        { label: 'CO2 Avoided', value: '13.4M tons' },
        { label: 'Superchargers', value: '50K+' }
      ],
      actions: [
        'Manufacture electric vehicles',
        'Build charging infrastructure',
        'Develop energy storage solutions',
        'Advance autonomous driving'
      ]
    },
    {
      id: 'greenpeace',
      title: 'Greenpeace International',
      description: 'Global environmental organization campaigning for a green and peaceful future.',
      type: 'ngo',
      element: 'earth',
      imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?q=80&w=1200&auto=format&fit=crop',
      website: 'https://greenpeace.org',
      location: 'Amsterdam, Netherlands',
      founded: '1971',
      metrics: [
        { label: 'Countries', value: '55+' },
        { label: 'Supporters', value: '3M+' },
        { label: 'Campaigns', value: '100+' }
      ],
      actions: [
        'Campaign against environmental destruction',
        'Promote renewable energy solutions',
        'Protect forests and oceans',
        'Advocate for climate action'
      ]
    },
    {
      id: 'mit-climate',
      title: 'MIT Climate Portal',
      description: 'Educational platform providing science-based climate information and solutions.',
      type: 'course',
      element: 'space',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
      website: 'https://climate.mit.edu',
      location: 'Cambridge, Massachusetts',
      founded: '2019',
      actions: [
        'Provide climate science education',
        'Research climate solutions',
        'Train future climate leaders',
        'Share knowledge globally'
      ]
    }
  ]);

  featuredItems = computed(() => {
    let items = this.allItems().filter(item => item.featured);
    
    if (this.focusType() !== 'all') {
      items = items.filter(item => item.type === this.focusType());
    }
    
    if (this.selectedElement) {
      items = items.filter(item => item.element === this.selectedElement);
    }
    
    return items;
  });

  filteredItems = computed(() => {
    let items = this.allItems();
    
    if (this.focusType() !== 'all') {
      items = items.filter(item => item.type === this.focusType());
    }
    
    if (this.selectedElement) {
      items = items.filter(item => item.element === this.selectedElement);
    }
    
    if (this.selectedType) {
      items = items.filter(item => item.type === this.selectedType);
    }
    
    if (this.showFeaturedOnly) {
      items = items.filter(item => item.featured);
    } else {
      items = items.filter(item => !item.featured);
    }
    
    return items;
  });

  totalPages = computed(() => Math.ceil(this.filteredItems().length / this.pageSize));

  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredItems().slice(start, end);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages = [];
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    
    return pages;
  });

  getPageTitle(): string {
    const type = this.focusType();
    const titles = {
      all: 'In Focus',
      ngo: 'NGOs in Focus',
      firm: 'Companies in Focus',
      city: 'Cities in Focus',
      innovation: 'Innovations in Focus',
      course: 'Courses in Focus'
    };
    return titles[type as keyof typeof titles] || 'In Focus';
  }

  getPageDescription(): string {
    const type = this.focusType();
    const descriptions = {
      all: 'Discover organizations, innovations, and initiatives making a positive environmental impact',
      ngo: 'Non-profit organizations leading environmental conservation efforts',
      firm: 'Companies pioneering sustainable business practices',
      city: 'Cities implementing innovative environmental policies',
      innovation: 'Breakthrough technologies solving environmental challenges',
      course: 'Educational resources for environmental learning'
    };
    return descriptions[type as keyof typeof descriptions] || '';
  }

  getTypeLabel(): string {
    const type = this.focusType();
    const labels = {
      all: 'Items',
      ngo: 'NGOs',
      firm: 'Companies',
      city: 'Cities',
      innovation: 'Innovations',
      course: 'Courses'
    };
    return labels[type as keyof typeof labels] || 'Items';
  }

  updateFilters() {
    this.currentPage.set(1);
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  openItem(item: FocusItem) {
    if (item.website) {
      window.open(item.website, '_blank');
    }
  }
}
