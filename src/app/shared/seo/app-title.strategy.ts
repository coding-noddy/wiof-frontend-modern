import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const built = this.buildTitle(snapshot);
    const suffix = 'World is One Family';
    this.title.setTitle(built ? `${built} • ${suffix}` : suffix);

    // Set description from route data if provided
    const tree = snapshot.root;
    let description: string | undefined;
    let node = tree;
    while (node) {
      if (node.data && node.data['description']) {
        description = node.data['description'];
      }
      node = node.firstChild!;
    }
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }
  }
}

