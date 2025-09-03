import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementBadgeComponent } from './element-badge.component';

export interface QuizQuestion {
  id: string;
  question: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-weekly-quiz-teaser',
  standalone: true,
  imports: [NgFor, RouterLink, ElementBadgeComponent],
  template: `
    <section class="section">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="section-title">Weekly Quiz</h2>
            <p class="section-sub">Test your environmental knowledge</p>
          </div>
          <a routerLink="/quiz" class="text-water hover:text-water/80 text-sm font-medium">
            Take full quiz
          </a>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Current quiz question -->
          <div class="card p-6">
            <div class="flex items-center gap-3 mb-4">
              <app-element-badge [element]="currentQuestion.element" />
              <span class="text-sm font-medium text-slate-600">This Week's Question</span>
            </div>
            
            <h3 class="font-semibold text-lg mb-4 leading-tight">{{ currentQuestion.question }}</h3>
            
            <div class="space-y-2 mb-6">
              <button 
                *ngFor="let option of currentQuestion.options; let i = index"
                class="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-water hover:bg-water/5 transition text-sm"
              >
                {{ option }}
              </button>
            </div>
            
            <a 
              routerLink="/quiz" 
              class="inline-flex items-center px-4 py-2 rounded-xl bg-water text-white text-sm font-medium hover:bg-water/90 transition"
            >
              Answer & See Results
            </a>
          </div>
          
          <!-- Last week's results -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-semibold text-slate-700">Last Week's Results</h4>
              <a routerLink="/quiz/archive" class="text-water hover:text-water/80 text-sm">View archive</a>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-600">Total Participants</span>
                <span class="font-semibold">{{ lastWeekStats.totalParticipants }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-600">Correct Answers</span>
                <span class="font-semibold text-green-600">{{ lastWeekStats.correctPercentage }}%</span>
              </div>
              
              <div class="bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  class="bg-green-500 h-full transition-all duration-500"
                  [style.width.%]="lastWeekStats.correctPercentage"
                ></div>
              </div>
              
              <div class="pt-2">
                <p class="text-sm text-slate-600 mb-2">Last week's question:</p>
                <p class="text-sm font-medium">{{ lastWeekStats.question }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WeeklyQuizTeaserComponent {
  currentQuestion: QuizQuestion = {
    id: 'q1',
    question: 'Which renewable energy source has the fastest growing capacity worldwide?',
    element: 'fire',
    options: [
      'Solar power',
      'Wind power', 
      'Hydroelectric power',
      'Geothermal power'
    ],
    correctAnswer: 0
  };

  lastWeekStats = {
    totalParticipants: 1247,
    correctPercentage: 73,
    question: 'What percentage of Earth\'s water is freshwater?'
  };
}
