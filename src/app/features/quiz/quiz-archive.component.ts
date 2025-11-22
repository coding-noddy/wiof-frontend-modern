import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Quiz } from '../../shared/models/quiz.model';
import { QUIZ_SERVICE } from '../../core/services/tokens';

@Component({
  selector: 'app-quiz-archive',
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe, RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="section-title">Quiz Archive</h1>
        <p class="section-sub mb-6">Browse previous quizzes and test your knowledge.</p>

        <!-- Loading state -->
        <div *ngIf="loading()" class="text-center py-12">
          <div class="text-slate-600">Loading quizzes...</div>
        </div>

        <!-- Quiz grid -->
        <div *ngIf="!loading()" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            *ngFor="let quiz of quizzes()"
            [routerLink]="['/quiz', quiz.id]"
            class="card p-4 block"
          >
            <div class="flex gap-2 mb-2 text-xs text-slate-500">
              <span>{{ quiz.element | titlecase }}</span>
              <span>•</span>
              <span>{{ quiz.questions.length }} questions</span>
            </div>
            <h3 class="font-semibold mb-1">{{ quiz.title }}</h3>
            <p class="text-slate-600 text-sm">{{ quiz.description }}</p>
            <div class="mt-3 text-xs text-slate-500">
              <span class="font-medium">{{ quiz.averageScore }}% avg score</span>
              <span class="mx-2">•</span>
              <span>{{ quiz.totalParticipants }} participants</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class QuizArchiveComponent implements OnInit {
  private quizService = inject(QUIZ_SERVICE);
  
  loading = signal(true);
  quizzes = signal<Quiz[]>([]);

  ngOnInit(): void {
    // Load all quizzes from service
    this.quizService.getQuizzes().subscribe(quizzes => {
      this.quizzes.set(quizzes);
      this.loading.set(false);
    });
  }
}
