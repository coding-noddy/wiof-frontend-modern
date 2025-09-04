import { Component } from '@angular/core';

@Component({
  selector: 'app-donate',
  standalone: true,
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Donate</h1>
        <p class="section-sub mb-8">Support our mission with a contribution.</p>
        <div class="grid sm:grid-cols-3 gap-4 max-w-3xl">
          <div class="card p-6 text-center">
            <h3 class="text-xl font-semibold mb-2">$10</h3>
            <p class="text-slate-600 mb-4">Help plant a tree</p>
            <button class="px-4 py-2 rounded-xl bg-water text-white w-full">Select</button>
          </div>
          <div class="card p-6 text-center">
            <h3 class="text-xl font-semibold mb-2">$25</h3>
            <p class="text-slate-600 mb-4">Provide clean water</p>
            <button class="px-4 py-2 rounded-xl bg-water text-white w-full">Select</button>
          </div>
          <div class="card p-6 text-center">
            <h3 class="text-xl font-semibold mb-2">$50</h3>
            <p class="text-slate-600 mb-4">Support outreach programs</p>
            <button class="px-4 py-2 rounded-xl bg-water text-white w-full">Select</button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DonateComponent {}
