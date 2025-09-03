import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-focus',
  standalone: true,
  template: `<section class="section"><div class="container"><h1 class="section-title">Focus: {{ type }}</h1><p class="section-sub">Coming soon…</p></div></section>`
})
export class FocusComponent {
  type: string | null;
  constructor(private route: ActivatedRoute) {
    this.type = this.route.snapshot.paramMap.get('type');
  }
}
