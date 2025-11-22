import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { BlogPost } from '../../shared/models/blog.model';
import { Meta, Title } from '@angular/platform-browser';
import { JsonLdService } from '../../shared/seo/json-ld.service';
import { BLOG_SERVICE } from '../../core/services/tokens';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, ElementBadgeComponent],
  template: `
    <!-- Loading state -->
    <div *ngIf="loading()" class="section">
      <div class="container max-w-4xl text-center py-12">
        <div class="text-slate-600">Loading article...</div>
      </div>
    </div>

    <article *ngIf="hasArticle()" class="section">
      <div class="container max-w-4xl">
        <!-- Hero Image -->
        <div class="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-8">
          <img [src]="article()!.heroUrl" [alt]="article()!.title"
               class="w-full h-full object-cover" />
        </div>

        <!-- Article Header -->
        <header class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <app-element-badge *ngIf="article()!.element" [element]="article()!.element!" />
            <span class="text-sm text-slate-500">{{ article()!.readTime }} min read</span>
            <span class="text-sm text-slate-500">{{ formatDate(article()!.publishedAt) }}</span>
          </div>

          <h1 class="text-4xl font-bold leading-tight mb-6">{{ article()!.title }}</h1>

          <div class="flex items-center gap-4 mb-6">
            <img [src]="article()!.author.avatar" [alt]="article()!.author.name"
                 class="w-12 h-12 rounded-full" />
            <div>
              <div class="font-semibold">{{ article()!.author.name }}</div>
              <div *ngIf="article()!.author.bio" class="text-sm text-slate-600">{{ article()!.author.bio }}</div>
            </div>
          </div>

          <div class="flex gap-2">
            <span *ngFor="let tag of article()!.tags"
                  class="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              {{ tag }}
            </span>
          </div>
        </header>

        <!-- Table of Contents -->
        <div class="card p-6 mb-8">
          <h3 class="font-semibold mb-4">Table of Contents</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="#introduction" class="text-water hover:text-water/80">Introduction</a></li>
            <li><a href="#main-content" class="text-water hover:text-water/80">Main Content</a></li>
            <li><a href="#key-insights" class="text-water hover:text-water/80">Key Insights</a></li>
            <li><a href="#conclusion" class="text-water hover:text-water/80">Conclusion</a></li>
          </ul>
        </div>

        <!-- Article Content -->
        <div class="prose prose-lg max-w-none mb-12">
          <div id="introduction">
            <h2>Introduction</h2>
            <p>{{ article()!.excerpt }}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>

          <div id="main-content">
            <h2>Main Content</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>

          <div id="key-insights">
            <h2>Key Insights</h2>
            <ul>
              <li>Environmental sustainability requires collective action</li>
              <li>Technology plays a crucial role in conservation efforts</li>
              <li>Individual choices can have significant cumulative impact</li>
              <li>Education and awareness are fundamental to change</li>
            </ul>
          </div>

          <div id="conclusion">
            <h2>Conclusion</h2>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          </div>
        </div>

        <!-- Related Articles -->
        <div class="border-t pt-8">
          <h3 class="text-2xl font-bold mb-6">Related Articles</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div *ngFor="let related of relatedArticles()" class="card overflow-hidden hover:shadow-md transition">
              <a [routerLink]="['/blog', related.slug]" class="block">
                <div class="aspect-video bg-slate-200 overflow-hidden">
                  <img [src]="related.heroUrl" [alt]="related.title"
                       class="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
                <div class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <app-element-badge *ngIf="related.element" [element]="related.element!" />
                    <span class="text-xs text-slate-500">{{ related.readTime }} min</span>
                  </div>
                  <h4 class="font-semibold leading-tight mb-2">{{ related.title }}</h4>
                  <p class="text-slate-600 text-sm line-clamp-2">{{ related.excerpt }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Back to Blog -->
        <div class="text-center mt-12">
          <a routerLink="/blog"
             class="inline-flex items-center px-6 py-3 rounded-xl bg-water text-white font-medium hover:bg-water/90 transition">
            ← Back to All Articles
          </a>
        </div>
      </div>
    </article>
  `
})
export class BlogDetailComponent implements OnInit {
  private blogService = inject(BLOG_SERVICE);
  private route = inject(ActivatedRoute);
  private meta = inject(Meta);
  private title = inject(Title);
  private jsonld = inject(JsonLdService);

  loading = signal(true);
  article = signal<BlogPost | null>(null);
  relatedArticles = signal<BlogPost[]>([]);

  slug = computed(() => this.route.snapshot.paramMap.get('slug') || '');

  ngOnInit(): void {
    // Load article when slug changes
    const slug = this.slug();
    if (!slug) return;

    this.blogService.getBlogPostBySlug(slug).subscribe(article => {
      this.article.set(article);
      this.updateMetadata(article);
      // Load related articles
      this.blogService.getRelatedPosts(article.id, 2).subscribe(posts => {
        this.relatedArticles.set(posts);
        this.loading.set(false);
      });
    });
  }

  private updateMetadata(article: BlogPost): void {
    const site = 'World is One Family';
    this.title.setTitle(`${article.title} • ${site}`);
    const desc = article.excerpt;
    const image = article.heroUrl;

    // Update meta tags
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: article.title });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image', content: image ?? '' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: article.title });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.meta.updateTag({ name: 'twitter:image', content: image ?? '' });

    // Update JSON-LD
    this.jsonld.setJsonLd('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: desc,
      author: { '@type': 'Person', name: article.author.name },
      datePublished: article.publishedAt,
      image,
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  hasArticle(): boolean {
    return this.article() !== null;
  }
}

