import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <section class="section">
      <div class="container prose max-w-3xl">
        <h1 class="section-title">Privacy Policy</h1>
        <p class="section-sub mb-8">How we handle your data (placeholder)</p>

        <div class="card p-6 not-prose">
          <p class="text-slate-700 mb-4">
            This is a placeholder Privacy Policy for the mock site. Replace with your
            organization’s actual policy before launch.
          </p>
          <ul class="list-disc pl-5 text-slate-700 space-y-2">
            <li>No personal data is collected in this mock.</li>
            <li>Newsletter inputs are non-functional placeholders.</li>
            <li>External links are provided for demonstration only.</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class PrivacyComponent {}

