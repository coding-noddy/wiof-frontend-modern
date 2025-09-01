import { Component, Input } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-element-badge',
  standalone: true,
  imports: [NgClass, TitleCasePipe],
  template: `
    <span
      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      [ngClass]="{
        'bg-earth/10 text-earth': element === 'earth',
        'bg-water/10 text-water': element === 'water',
        'bg-fire/10 text-fire': element === 'fire',
        'bg-air/10 text-air': element === 'air',
        'bg-space/10 text-space': element === 'space'
      }"
    >
      {{ element | titlecase }}
    </span>
  `,
})
export class ElementBadgeComponent {
  @Input() element: 'earth' | 'water' | 'fire' | 'air' | 'space' = 'earth';
}
