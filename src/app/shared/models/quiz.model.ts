export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  element?: 'earth' | 'water' | 'fire' | 'air' | 'space';
  publishedAt: string;
  totalParticipants: number;
  averageScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
}
