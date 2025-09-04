import { Component, computed, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { BlogPost, BlogFilter } from '../../shared/models/blog.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, FormsModule, ElementBadgeComponent],
  template: `
    <section class="section">
      <div class="container">
        <div class="text-center mb-8">
          <h1 class="section-title">Environmental Blog</h1>
          <p class="section-sub">Stories, insights, and updates from our community</p>
        </div>

        <!-- Search and Filters -->
        <div class="card p-6 mb-8">
          <div class="grid md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <input
                type="text"
                placeholder="Search articles..."
                [(ngModel)]="searchTerm"
                (input)="updateFilters()"
                class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
              />
            </div>
            
            <!-- Element Filter -->
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
            
            <!-- Tag Filter -->
            <select
              [(ngModel)]="selectedTag"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Topics</option>
              <option value="climate">Climate</option>
              <option value="conservation">Conservation</option>
              <option value="renewable">Renewable Energy</option>
              <option value="sustainability">Sustainability</option>
              <option value="innovation">Innovation</option>
            </select>
          </div>
        </div>

        <!-- Featured Articles -->
        <div *ngIf="featuredArticles().length > 0" class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Featured Articles</h2>
          <div class="grid lg:grid-cols-2 gap-8">
            <div *ngFor="let article of featuredArticles()" class="card overflow-hidden hover:shadow-lg transition">
              <a [routerLink]="['/blog', article.slug]" class="block group">
                <div class="aspect-video bg-slate-200 overflow-hidden">
                  <img [src]="article.heroUrl" [alt]="article.title" 
                       class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div class="p-6">
                  <div class="flex items-center gap-3 mb-3">
                    <app-element-badge *ngIf="article.element" [element]="article.element" />
                    <span class="text-sm text-slate-500">{{ article.readTime }} min read</span>
                    <span class="text-sm text-slate-500">{{ formatDate(article.publishedAt) }}</span>
                  </div>
                  <h3 class="font-semibold text-xl leading-tight mb-3">{{ article.title }}</h3>
                  <p class="text-slate-600 mb-4">{{ article.excerpt }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img [src]="article.author.avatar" [alt]="article.author.name" 
                           class="w-8 h-8 rounded-full" />
                      <span class="text-sm font-medium">{{ article.author.name }}</span>
                    </div>
                    <div class="flex gap-2">
                      <span *ngFor="let tag of article.tags.slice(0, 2)" 
                            class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- All Articles -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">All Articles</h2>
            <div class="text-sm text-slate-600">{{ filteredArticles().length }} articles</div>
          </div>
          
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let article of paginatedArticles()" class="card overflow-hidden hover:shadow-md transition">
              <a [routerLink]="['/blog', article.slug]" class="block group">
                <div class="aspect-video bg-slate-200 overflow-hidden">
                  <img [src]="article.heroUrl" [alt]="article.title" 
                       class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <app-element-badge *ngIf="article.element" [element]="article.element" />
                    <span class="text-xs text-slate-500">{{ article.readTime }} min</span>
                  </div>
                  <h3 class="font-semibold leading-tight mb-2">{{ article.title }}</h3>
                  <p class="text-slate-600 text-sm mb-3 line-clamp-2">{{ article.excerpt }}</p>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500">{{ formatDate(article.publishedAt) }}</span>
                    <span class="font-medium">{{ article.author.name }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-2">
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
      </div>
    </section>
  `,
})
export class BlogComponent {
  searchTerm = '';
  selectedElement = '';
  selectedTag = '';
  currentPage = signal(1);
  pageSize = 9;

  allArticles = signal<BlogPost[]>([
    {
      id: '1',
      title: 'The Future of Renewable Energy: Solar Power Innovations',
      slug: 'future-renewable-energy-solar',
      excerpt: 'Exploring cutting-edge solar technologies that are revolutionizing clean energy production worldwide.',
      content: '',
      heroUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
      publishedAt: '2025-09-01',
      author: { name: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop' },
      tags: ['renewable', 'solar', 'innovation'],
      element: 'fire',
      readTime: 8,
      featured: true
    },
    {
      id: '2',
      title: 'Ocean Conservation: Protecting Marine Biodiversity',
      slug: 'ocean-conservation-marine-biodiversity',
      excerpt: 'How marine protected areas are helping restore ocean ecosystems and protect endangered species.',
      content: '',
      heroUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop',
      publishedAt: '2025-08-28',
      author: { name: 'Marine Biologist Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
      tags: ['conservation', 'marine', 'biodiversity'],
      element: 'water',
      readTime: 6,
      featured: true
    },
    {
      id: '3',
      title: 'Urban Forests: Green Solutions for City Air Quality',
      slug: 'urban-forests-city-air-quality',
      excerpt: 'Discover how urban forestry initiatives are improving air quality and creating healthier cities.',
      content: '',
      heroUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
      publishedAt: '2025-08-25',
      author: { name: 'Urban Planner Maria Santos', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' },
      tags: ['urban', 'forests', 'air quality'],
      element: 'air',
      readTime: 5
    },
    {
      id: '4',
      title: 'Sustainable Agriculture: Regenerative Farming Practices',
      slug: 'sustainable-agriculture-regenerative-farming',
      excerpt: 'Learn about farming methods that restore soil health while producing nutritious food.',
      content: '',
      heroUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      publishedAt: '2025-08-22',
      author: { name: 'Farmer John Thompson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
      tags: ['agriculture', 'sustainability', 'soil'],
      element: 'earth',
      readTime: 7
    },
    {
      id: '5',
      title: 'Mindful Living: Connecting with Nature for Wellbeing',
      slug: 'mindful-living-nature-wellbeing',
      excerpt: 'Explore how mindfulness practices in nature can improve mental health and environmental awareness.',
      content: '',
      heroUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
      publishedAt: '2025-08-20',
      author: { name: 'Wellness Coach Emma Wilson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop' },
      tags: ['mindfulness', 'wellbeing', 'nature'],
      element: 'space',
      readTime: 4
    },
    {
      id: '6',
      title: 'Climate Action: Individual Steps for Global Impact',
      slug: 'climate-action-individual-global-impact',
      excerpt: 'Simple daily actions that can contribute to meaningful climate change mitigation.',
      content: '',
      heroUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?q=80&w=1200&auto=format&fit=crop',
      publishedAt: '2025-08-18',
      author: { name: 'Climate Activist David Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' },
      tags: ['climate', 'action', 'individual'],
      element: 'fire',
      readTime: 6
    }
  ]);

  featuredArticles = computed(() => 
    this.allArticles().filter(article => article.featured)
  );

  filteredArticles = computed(() => {
    let articles = this.allArticles().filter(article => !article.featured);
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(term))
      );
    }
    
    if (this.selectedElement) {
      articles = articles.filter(article => article.element === this.selectedElement);
    }
    
    if (this.selectedTag) {
      articles = articles.filter(article => article.tags.includes(this.selectedTag));
    }
    
    return articles;
  });

  totalPages = computed(() => Math.ceil(this.filteredArticles().length / this.pageSize));

  paginatedArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredArticles().slice(start, end);
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
