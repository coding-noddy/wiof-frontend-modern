import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  standalone: true,
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Blog</h1>
        <p class="section-sub">Articles coming soon…</p>
      </div>
    </section>
  `,
})
export class BlogComponent {}
