import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-element-card',
  standalone: true,
  imports: [RouterLink, NgStyle],
  template: `
    <a
      [routerLink]="['/element', tag]"
      class="card p-6 flex flex-col gap-3 hover:shadow-lg transition"
    >
      <div class="w-12 h-12 rounded-2xl" [ngStyle]="{ background: gradient }"></div>
      <div>
        <h3 class="font-semibold text-lg">{{ title }}</h3>
        <p class="text-slate-600 text-sm">{{ description }}</p>
      </div>
    </a>
  `,
})
export class ElementCardComponent {
  @Input() tag!: 'earth' | 'water' | 'fire' | 'air' | 'space';
  @Input() title!: string;
  @Input() description!: string;

  get gradient() {
    switch (this.tag) {
      case 'earth':
        return 'linear-gradient(135deg,#8B5E3C,#b5835a)';
      case 'water':
        return 'linear-gradient(135deg,#0EA5E9,#60a5fa)';
      case 'fire':
        return 'linear-gradient(135deg,#EF4444,#f59e0b)';
      case 'air':
        return 'linear-gradient(135deg,#38BDF8,#34d399)';
      case 'space':
        return 'linear-gradient(135deg,#6D28D9,#9333ea)';
      default:
        return '#e2e8f0';
    }
  }
}
