import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Contact</h1>
        <p class="section-sub mb-8">We'd love to hear from you. Send us a message!</p>

        <form class="max-w-xl space-y-4">
          <input
            type="text"
            placeholder="Your name"
            class="w-full border border-slate-300 rounded-xl px-3 py-2"
          />
          <input
            type="email"
            placeholder="you@example.com"
            class="w-full border border-slate-300 rounded-xl px-3 py-2"
          />
          <textarea
            rows="5"
            placeholder="Your message"
            class="w-full border border-slate-300 rounded-xl px-3 py-2"
          ></textarea>
          <button type="button" class="px-6 py-3 rounded-xl bg-water text-white">
            Send Message
          </button>
        </form>
      </div>
    </section>
  `,
})
export class ContactComponent {}
