import { Observable } from 'rxjs';
import { Quiz, QuizResult } from '../../../shared/models/quiz.model';

export interface IQuizService {
  getQuizzes(element?: string): Observable<Quiz[]>;
  getQuizById(id: string): Observable<Quiz>;
  submitQuizResult(result: QuizResult): Observable<void>;
  getUserResults(): Observable<QuizResult[]>;
  getWeeklyQuiz(): Observable<Quiz>;
}