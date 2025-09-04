import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-archive',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Quiz Archive</h1>
        <p class="section-sub mb-6">Browse previous quizzes and test your knowledge.</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            *ngFor="let quiz of quizzes"
            [routerLink]="['/quiz', quiz.slug]"
            class="card p-4 block"
          >
            <h3 class="font-semibold mb-1">{{ quiz.title }}</h3>
            <p class="text-slate-600 text-sm">{{ quiz.description }}</p>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class QuizArchiveComponent {
  quizzes = [
    {
      title: 'Earth Day Challenge',
      slug: 'earth-day-challenge',
      description: 'Test your knowledge about protecting the planet.',
    },
    {
      title: 'Water Conservation Quiz',
      slug: 'water-conservation',
      description: 'How much do you know about saving water?',
    },
    {
      title: 'Clean Air Awareness',
      slug: 'clean-air',
      description: 'Learn about air pollution and solutions.',
    },
  ];
}
