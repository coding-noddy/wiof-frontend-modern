import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { IActionService } from '../interfaces/action.service.interface';
import { ActionItem, ActionProgress } from '../../../shared/models/action.model';

// Mock Data
const MOCK_ACTIONS: ActionItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `action-${i + 1}`,
  title: `${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} Conservation Challenge ${Math.floor(i / 5) + 1}`,
  description: `Take action to protect and preserve ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]}.`,
  difficulty: ['easy', 'medium', 'hard'][i % 3] as any,
  timeNeeded: ['5 min', '15 min', '30 min', '1 hour'][i % 4],
  impactScore: Math.floor(Math.random() * 50) + 50,
  category: ['conservation', 'education', 'community', 'innovation'][i % 4],
  element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
  checklist: Array(4).fill(0).map((_, j) => `Step ${j + 1}: Sample action step`),
  completedBy: Math.floor(Math.random() * 1000),
  resources: [
    {
      title: 'Learn More',
      url: 'https://example.com',
      type: ['article', 'video', 'tool', 'guide'][i % 4] as any
    }
  ]
}));

const MOCK_USER_PROGRESS: ActionProgress[] = [
  {
    actionId: 'action-1',
    completedSteps: [0, 1],
    startedAt: new Date(2025, 10, 1).toISOString(),
    pledged: true
  },
  {
    actionId: 'action-2',
    completedSteps: [0, 1, 2, 3],
    startedAt: new Date(2025, 10, 2).toISOString(),
    completedAt: new Date(2025, 10, 3).toISOString(),
    pledged: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class FirebaseActionService extends BaseService implements IActionService {
  private db = inject(Firestore);

  getActions(filters: {
    element?: string;
    difficulty?: string;
    category?: string;
    timeNeeded?: string;
  }): Observable<ActionItem[]> {
    if (this.isMockBackend) {
      let filteredActions = [...MOCK_ACTIONS];
      
      if (filters.element) {
        filteredActions = filteredActions.filter(a => a.element === filters.element);
      }
      if (filters.difficulty) {
        filteredActions = filteredActions.filter(a => a.difficulty === filters.difficulty);
      }
      if (filters.category) {
        filteredActions = filteredActions.filter(a => a.category === filters.category);
      }
      if (filters.timeNeeded) {
        filteredActions = filteredActions.filter(a => a.timeNeeded === filters.timeNeeded);
      }
      
      return this.withMockDelay(filteredActions);
    }

    const actionCollection = collection(this.db, 'actions');
    let actionQuery = query(actionCollection);

    // Add filters
    if (filters.element) {
      actionQuery = query(actionQuery, where('element', '==', filters.element));
    }
    if (filters.difficulty) {
      actionQuery = query(actionQuery, where('difficulty', '==', filters.difficulty));
    }
    if (filters.category) {
      actionQuery = query(actionQuery, where('category', '==', filters.category));
    }
    if (filters.timeNeeded) {
      actionQuery = query(actionQuery, where('timeNeeded', '==', filters.timeNeeded));
    }

    return from(getDocs(actionQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ActionItem))
      ),
      map(data => this.convertTimestamps<ActionItem[]>(data))
    );
  }

  getUserProgress(): Observable<ActionProgress[]> {
    if (this.isMockBackend) {
      return this.withMockDelay(MOCK_USER_PROGRESS);
    }

    const progressCollection = collection(this.db, 'userProgress');
    return from(getDocs(progressCollection)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ActionProgress))
      ),
      map(data => this.convertTimestamps<ActionProgress[]>(data))
    );
  }

  updateProgress(progress: ActionProgress): Observable<void> {
    if (this.isMockBackend) {
      console.log('Mock: Updating action progress', progress);
      return this.withMockDelay(void 0);
    }

    // Implement Firebase update
    return from(Promise.resolve());
  }

  pledgeAction(actionId: string): Observable<void> {
    if (this.isMockBackend) {
      console.log('Mock: Pledging action', actionId);
      return this.withMockDelay(void 0);
    }

    // Implement Firebase pledge
    return from(Promise.resolve());
  }

  unpledgeAction(actionId: string): Observable<void> {
    if (this.isMockBackend) {
      console.log('Mock: Unpledging action', actionId);
      return this.withMockDelay(void 0);
    }

    // Implement Firebase unpledge
    return from(Promise.resolve());
  }
}