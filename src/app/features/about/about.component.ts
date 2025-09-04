import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="section">
      <div class="container prose">
        <h1 class="section-title">About Us</h1>
        <p class="section-sub mb-8">Learn more about the World is One Family initiative.</p>
        <p>
          World is One Family is a collective movement dedicated to living in harmony with the five
          elements—earth, water, fire, air and space. We share stories, tools and actions to inspire
          sustainable living.
        </p>
        <p>
          This mock page showcases the type of content that will appear here in the future,
          including our mission, team and history.
        </p>
      </div>
    </section>
  `,
})
export class AboutComponent {}
