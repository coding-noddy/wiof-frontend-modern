import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-slate-200 mt-16">
      <div class="container py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="flex items-center gap-2 font-semibold">
            <span
              class="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-water to-space"
            ></span>
            <span>World is One Family</span>
          </div>
          <p class="text-slate-600 mt-3">Vasudhaiva Kutumbakam — The world is one family.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Explore</h4>
          <ul class="space-y-2 text-slate-700">
            <li><a routerLink="/elements">Elements</a></li>
            <li><a routerLink="/videos">Videos</a></li>
            <li><a routerLink="/blog">Blog</a></li>
            <li><a routerLink="/about">About</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Get Involved</h4>
          <ul class="space-y-2 text-slate-700">
            <li><a routerLink="/get-involved">Volunteer</a></li>
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/privacy-policy">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Newsletter</h4>
          <p class="text-slate-600 mb-3">Join the family — stay updated.</p>
          <form class="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              class="flex-1 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-water"
            />
            <button class="px-4 py-2 rounded-xl bg-water text-white">Subscribe</button>
          </form>
        </div>
      </div>
      <div class="border-t border-slate-200">
        <div class="container py-4 text-sm text-slate-600">© {{ year }} World is One Family</div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
