import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JsonLdService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setJsonLd(id: string, data: unknown) {
    let script = this.doc.head.querySelector<HTMLScriptElement>(`script#${id}`);
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}

