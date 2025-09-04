import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { Quiz, QuizQuestion, QuizResult } from '../../shared/models/quiz.model';
import { QUIZ_SERVICE } from '../../core/services/tokens';
import { IQuizService } from '../../core/services/interfaces/quiz.service.interface';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, ElementBadgeComponent],
  template: `
    <section class="section">
      <div class="container max-w-4xl">
        <div class="text-center mb-8">
          <h1 class="section-title">Weekly Environmental Quiz</h1>
          <p class="section-sub">Test your knowledge and learn about our planet</p>
        </div>

        <!-- Loading state -->
        <div *ngIf="!hasQuiz()" class="text-center py-12">
          <div class="text-slate-600">Loading quiz...</div>
        </div>

        <!-- Current Quiz -->
        <div *ngIf="hasQuiz() && !showResults()" class="space-y-8">
          <!-- Quiz Header -->
          <div class="card p-6 text-center">
            <div class="flex items-center justify-center gap-3 mb-4">
              <app-element-badge [element]="currentQuestion()!.element" />
              <span class="text-sm font-medium text-slate-600">
                Question {{ currentQuestionIndex() + 1 }} of {{ currentQuiz()!.questions.length }}
              </span>
            </div>
            <h2 class="text-2xl font-bold mb-2">{{ currentQuiz()!.title }}</h2>
            <p class="text-slate-600">{{ currentQuiz()!.description }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="card p-4">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-slate-600">Progress</span>
              <span class="font-medium">{{ Math.round(((currentQuestionIndex() + 1) / currentQuiz()!.questions.length) * 100) }}%</span>
            </div>
            <div class="bg-slate-200 rounded-full h-2 overflow-hidden">
              <div class="bg-water h-full transition-all duration-500" 
                   [style.width.%]="((currentQuestionIndex() + 1) / currentQuiz()!.questions.length) * 100"></div>
            </div>
          </div>

          <!-- Current Question -->
          <div class="card p-8">
            <h3 class="text-xl font-semibold mb-6 leading-tight">
              {{ currentQuestion()?.question }}
            </h3>
            
            <div class="space-y-3 mb-8">
              <button 
                *ngFor="let option of currentQuestion()?.options || []; let i = index"
                (click)="selectAnswer(i)"
                class="w-full text-left p-4 rounded-xl border-2 transition"
                [ngClass]="{
                  'border-water bg-water/5': selectedAnswer() === i,
                  'border-slate-200 hover:border-water/50 hover:bg-slate-50': selectedAnswer() !== i
                }"
              >
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                       [ngClass]="{
                         'border-water bg-water': selectedAnswer() === i,
                         'border-slate-300': selectedAnswer() !== i
                       }">
                    <div *ngIf="selectedAnswer() === i" class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="font-medium">{{ option }}</span>
                </div>
              </button>
            </div>
            
            <div class="flex justify-between">
              <button 
                *ngIf="currentQuestionIndex() > 0"
                (click)="previousQuestion()"
                class="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <div></div>
              <button 
                (click)="nextQuestion()"
                [disabled]="selectedAnswer() === null"
                class="px-6 py-3 rounded-xl bg-water text-white font-medium hover:bg-water/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{ isLastQuestion() ? 'Finish Quiz' : 'Next Question' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quiz Results -->
        <div *ngIf="hasQuiz() && showResults()" class="space-y-8">
          <!-- Results Header -->
          <div class="card p-8 text-center">
            <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                 [ngClass]="{
                   'bg-green-100': getScorePercentage() >= 80,
                   'bg-yellow-100': getScorePercentage() >= 60 && getScorePercentage() < 80,
                   'bg-red-100': getScorePercentage() < 60
                 }">
              <span class="text-3xl font-bold"
                    [ngClass]="{
                      'text-green-600': getScorePercentage() >= 80,
                      'text-yellow-600': getScorePercentage() >= 60 && getScorePercentage() < 80,
                      'text-red-600': getScorePercentage() < 60
                    }">
                {{ getScorePercentage() }}%
              </span>
            </div>
            <h2 class="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p class="text-slate-600 mb-4">
              You scored {{ getCorrectAnswersCount() }} 
              out of {{ currentQuiz()!.questions.length }} questions correctly.
            </p>
            <div class="text-sm text-slate-500">
              {{ getScoreMessage() }}
            </div>
          </div>

          <!-- Question Review -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold">Review Your Answers</h3>
            <div *ngFor="let question of currentQuiz()!.questions; let i = index" class="card p-6">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                     [ngClass]="{
                       'bg-green-100 text-green-600': userAnswers()[i] === question.correctAnswer,
                       'bg-red-100 text-red-600': userAnswers()[i] !== question.correctAnswer
                     }">
                  <span class="text-sm font-bold">{{ i + 1 }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <app-element-badge [element]="question.element" />
                    <span *ngIf="userAnswers()[i] === question.correctAnswer" class="text-green-600 text-sm font-medium">✓ Correct</span>
                    <span *ngIf="userAnswers()[i] !== question.correctAnswer" class="text-red-600 text-sm font-medium">✗ Incorrect</span>
                  </div>
                  <h4 class="font-semibold mb-3">{{ question.question }}</h4>
                  <div class="space-y-2">
                    <div *ngFor="let option of question.options; let j = index" 
                         class="p-2 rounded-lg text-sm"
                         [ngClass]="{
                           'bg-green-100 text-green-800': j === question.correctAnswer,
                           'bg-red-100 text-red-800': j === userAnswers()[i] && j !== question.correctAnswer,
                           'bg-slate-50': j !== question.correctAnswer && j !== userAnswers()[i]
                         }">
                      <span class="font-medium">{{ getOptionLetter(j) }}.</span> {{ option }}
                      <span *ngIf="j === question.correctAnswer" class="ml-2 text-green-600">✓</span>
                      <span *ngIf="j === userAnswers()[i] && j !== question.correctAnswer" class="ml-2 text-red-600">✗</span>
                    </div>
                  </div>
                  <div *ngIf="question.explanation" class="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-800">{{ question.explanation }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-center gap-4">
            <button 
              (click)="retakeQuiz()"
              class="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
            >
              Retake Quiz
            </button>
            <a routerLink="/quiz/archive" 
               class="px-6 py-3 rounded-xl bg-water text-white font-medium hover:bg-water/90 transition">
              View Past Quizzes
            </a>
          </div>
        </div>

        <!-- Quiz Stats -->
        <div class="card p-6 mt-8">
          <h3 class="font-semibold mb-4">This Week's Stats</h3>
          <div class="grid sm:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-water">{{ currentQuiz()!.totalParticipants }}</div>
              <div class="text-sm text-slate-600">Total Participants</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-water">{{ currentQuiz()!.averageScore }}%</div>
              <div class="text-sm text-slate-600">Average Score</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-water">{{ currentQuiz()!.questions.length }}</div>
              <div class="text-sm text-slate-600">Questions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class QuizComponent implements OnInit {
  private quizService = inject(QUIZ_SERVICE);
  
  currentQuestionIndex = signal(0);
  selectedAnswer = signal<number | null>(null);
  userAnswers = signal<number[]>([]);
  showResults = signal(false);
  currentQuiz = signal<Quiz | null>(null);
  loading = signal(true);
  
  ngOnInit(): void {
    // Get the weekly quiz when component initializes
    this.quizService.getWeeklyQuiz().subscribe(quiz => {
      this.currentQuiz.set(quiz);
      this.loading.set(false);
    });
  }

  hasQuiz(): boolean {
    return this.currentQuiz() !== null;
  }

  currentQuestion = computed(() => {
    const quiz = this.currentQuiz();
    return quiz ? quiz.questions[this.currentQuestionIndex()] : undefined;
  });

  selectAnswer(answerIndex: number) {
    this.selectedAnswer.set(answerIndex);
  }

  isLastQuestion(): boolean {
    const quiz = this.currentQuiz();
    if (!quiz) return false;
    return this.currentQuestionIndex() === quiz.questions.length - 1;
  }

  nextQuestion() {
    if (this.selectedAnswer() === null || !this.hasQuiz()) return;
    
    const answers = [...this.userAnswers()];
    answers[this.currentQuestionIndex()] = this.selectedAnswer()!;
    this.userAnswers.set(answers);
    
    if (this.isLastQuestion()) {
      const quiz = this.currentQuiz()!;
      const result: QuizResult = {
        quizId: quiz.id,
        score: this.getScorePercentage(),
        totalQuestions: quiz.questions.length,
        answers: answers,
        completedAt: new Date().toISOString(),
      };
      this.quizService.submitQuizResult(result).subscribe(() => {
        this.showResults.set(true);
      });
    } else {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedAnswer.set(null);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
      this.selectedAnswer.set(this.userAnswers()[this.currentQuestionIndex()] ?? null);
    }
  }

  getCorrectAnswersCount(): number {
    const quiz = this.currentQuiz();
    if (!quiz) return 0;
    return this.userAnswers().filter((answer, i) => 
      answer === quiz.questions[i].correctAnswer
    ).length;
  }

  getScorePercentage(): number {
    const quiz = this.currentQuiz();
    if (!quiz) return 0;
    const correct = this.getCorrectAnswersCount();
    return Math.round((correct / quiz.questions.length) * 100);
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getScoreMessage(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 80) return 'Excellent! You\'re an environmental expert!';
    if (percentage >= 60) return 'Good job! Keep learning about our environment.';
    return 'Keep studying! Every step towards environmental awareness counts.';
  }

  retakeQuiz() {
    this.currentQuestionIndex.set(0);
    this.selectedAnswer.set(null);
    this.userAnswers.set([]);
    this.showResults.set(false);
  }

  Math = Math;
}
