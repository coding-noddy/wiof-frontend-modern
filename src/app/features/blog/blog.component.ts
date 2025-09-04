import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { BlogPost, BlogFilter } from '../../shared/models/blog.model';
import { BLOG_SERVICE } from '../../core/services/tokens';
import { IBlogService } from '../../core/services/interfaces/blog.service.interface';

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

        <!-- Loading state -->
        <div *ngIf="loading()" class="text-center py-12">
          <div class="text-slate-600">Loading articles...</div>
        </div>

        <!-- Featured Articles -->
        <ng-container *ngIf="!loading()">
          <div *ngIf="featuredArticles().length > 0" class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Featured Articles</h2>
            <div class="grid lg:grid-cols-2 gap-8">
              <div *ngFor="let article of featuredArticles()" class="card overflow-hidden hover:shadow-lg transition">
                <a [routerLink]="['/blog', article.slug]" class="block group">
                  <div class="aspect-video bg-slate-200 overflow-hidden">
                    <img [src]="article.heroUrl" [alt]="article.title" 
                         class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
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

          <!-- Regular Articles -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold">All Articles</h2>
              <div class="text-sm text-slate-600">{{ regularArticles().length }} articles</div>
            </div>
            
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let article of regularArticles()" class="card overflow-hidden hover:shadow-md transition">
                <a [routerLink]="['/blog', article.slug]" class="block group">
                  <div class="aspect-video bg-slate-200 overflow-hidden">
                    <img [src]="article.heroUrl" [alt]="article.title" 
                         class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
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
            <span class="text-sm text-slate-600">Page {{ currentPage() }}</span>
            <button 
              (click)="nextPage()" 
              [disabled]="!hasMore()"
              class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </ng-container>
      </div>
    </section>
  `,
})
export class BlogComponent implements OnInit {
  private blogService = inject(BLOG_SERVICE);
  
  searchTerm = '';
  selectedElement = '';
  selectedTag = '';
  pageSize = 9;
  loading = signal(true);
  hasMore = signal(false);

  // Split articles into featured and non-featured collections
  featuredArticles = signal<BlogPost[]>([]);
  regularArticles = signal<BlogPost[]>([]);
  currentPage = signal(1);

  ngOnInit(): void {
    // Load featured articles
    this.loadFeaturedArticles();
    
    // Load regular articles
    this.loadArticles();
  }

  private loadFeaturedArticles(): void {
    // Get featured articles using first page with small size
    this.blogService.getBlogPosts(1, 2).subscribe(response => {
      this.featuredArticles.set(response.posts);
    });
  }

  private loadArticles(): void {
    this.loading.set(true);
    // Load paginated articles
    this.blogService
      .getBlogPosts(
        this.currentPage(), 
        this.pageSize, 
        this.selectedElement || undefined
      )
      .subscribe(response => {
        this.regularArticles.set(response.posts);
        this.hasMore.set(response.hasMore);
        this.loading.set(false);
      });
  }

  // No longer need computed featuredArticles since we get them directly from service

  // No longer need filteredArticles computed since filtering is handled by service

  updateFilters(): void {
    this.currentPage.set(1);
    this.loadArticles(); // Reload articles with new filters
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadArticles();
    }
  }

  nextPage(): void {
    // Can go to next page if we have more articles
    if (this.hasMore()) {
      this.currentPage.update(p => p + 1);
      this.loadArticles();
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadArticles();
  }

  private applyFilters(): void {
    // Reload articles with current filters
    this.loadArticles();
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
