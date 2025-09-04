import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { JsonLdService } from './shared/seo/json-ld.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <a class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-white shadow rounded px-3 py-2" href="#main">Skip to content</a>
    <app-header />
    <main id="main" class="min-h-[70vh]">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class AppComponent {
  private jsonld = inject(JsonLdService);

  constructor() {
    // WebSite + SearchAction JSON-LD
    this.jsonld.setJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'World is One Family',
      url: 'https://worldisonefamily.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://worldisonefamily.com/search?q={query}',
        'query-input': 'required name=query',
      },
    });

    // Organization JSON-LD (basic placeholder)
    this.jsonld.setJsonLd('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'World is One Family',
      url: 'https://worldisonefamily.com',
      logo: 'https://worldisonefamily.com/assets/logo.png',
    });
  }
}
