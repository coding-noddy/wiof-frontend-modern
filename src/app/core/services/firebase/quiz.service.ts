import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { IQuizService } from '../interfaces/quiz.service.interface';
import { Quiz, QuizResult } from '../../../shared/models/quiz.model';

// Mock Data
const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'weekly-earth-1',
    title: 'Earth Element Weekly Challenge',
    description: 'Test your knowledge about soil conservation and biodiversity',
    element: 'earth',
    questions: [
      {
        id: 'q1',
        question: 'Which practice helps improve soil health?',
        element: 'earth',
        options: [
          'Crop rotation',
          'Constant tilling',
          'Single crop farming',
          'Removing organic matter'
        ],
        correctAnswer: 0,
        explanation: 'Crop rotation helps maintain soil nutrients and prevent soil depletion.'
      },
      // More questions...
    ],
    publishedAt: new Date(2025, 10, 1).toISOString(),
    totalParticipants: 1250,
    averageScore: 72
  },
  // More quizzes for other elements...
].concat(
  Array.from({ length: 15 }).map((_, i) => ({
    id: `quiz-${i + 1}`,
    title: `${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} Element Quiz ${Math.floor(i / 5) + 1}`,
    description: `Test your knowledge about ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} element`,
    element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
    questions: Array.from({ length: 5 }).map((_, j) => ({
      id: `q${j + 1}`,
      question: `Sample Question ${j + 1}`,
      element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: 'Sample explanation for the correct answer.'
    })),
    publishedAt: new Date(2025, 9, i + 1).toISOString(),
    totalParticipants: Math.floor(Math.random() * 1000) + 100,
    averageScore: Math.floor(Math.random() * 30) + 60
  }))
);

@Injectable({
  providedIn: 'root'
})
export class FirebaseQuizService extends BaseService implements IQuizService {
  private db = inject(Firestore);

  getQuizzes(element?: string): Observable<Quiz[]> {
    if (this.isMockBackend) {
      const filteredQuizzes = element 
        ? MOCK_QUIZZES.filter(quiz => quiz.element === element)
        : MOCK_QUIZZES;
      return this.withMockDelay(filteredQuizzes);
    }

    const quizCollection = collection(this.db, 'quizzes');
    const quizQuery = element
      ? query(quizCollection, where('element', '==', element))
      : query(quizCollection);

    return from(getDocs(quizQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Quiz))
      ),
      map(data => this.convertTimestamps<Quiz[]>(data))
    );
  }

  getQuizById(id: string): Observable<Quiz> {
    if (this.isMockBackend) {
      const quiz = MOCK_QUIZZES.find(q => q.id === id);
      if (!quiz) {
        return this.handleError(new Error('Quiz not found'));
      }
      return this.withMockDelay(quiz);
    }

    const quizCollection = collection(this.db, 'quizzes');
    const quizQuery = query(quizCollection, where('id', '==', id), limit(1));

    return from(getDocs(quizQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          throw new Error('Quiz not found');
        }
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as Quiz;
      }),
      map(data => this.convertTimestamps<Quiz>(data))
    );
  }

  submitQuizResult(result: QuizResult): Observable<void> {
    if (this.isMockBackend) {
      console.log('Mock: Submitting quiz result', result);
      return this.withMockDelay(void 0);
    }

    // Implement Firebase submission
    return from(Promise.resolve());
  }

  getUserResults(): Observable<QuizResult[]> {
    if (this.isMockBackend) {
      const mockResults: QuizResult[] = MOCK_QUIZZES.slice(0, 3).map(quiz => ({
        quizId: quiz.id,
        score: Math.floor(Math.random() * 5) + 3,
        totalQuestions: 5,
        answers: Array(5).fill(0).map(() => Math.floor(Math.random() * 4)),
        completedAt: new Date().toISOString()
      }));
      return this.withMockDelay(mockResults);
    }

    // Implement Firebase fetch
    return from(Promise.resolve([]));
  }

  getWeeklyQuiz(): Observable<Quiz> {
    if (this.isMockBackend) {
      return this.withMockDelay(MOCK_QUIZZES[0]);
    }

    const quizCollection = collection(this.db, 'quizzes');
    const quizQuery = query(
      quizCollection,
      where('isWeekly', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(1)
    );

    return from(getDocs(quizQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          throw new Error('No weekly quiz found');
        }
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as Quiz;
      }),
      map(data => this.convertTimestamps<Quiz>(data))
    );
  }
}