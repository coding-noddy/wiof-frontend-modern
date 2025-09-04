import { Observable } from 'rxjs';
import { ActionItem, ActionProgress } from '../../../shared/models/action.model';

export interface IActionService {
  getActions(filters: {
    element?: string;
    difficulty?: string;
    category?: string;
    timeNeeded?: string;
  }): Observable<ActionItem[]>;
  
  getUserProgress(): Observable<ActionProgress[]>;
  updateProgress(progress: ActionProgress): Observable<void>;
  
  pledgeAction(actionId: string): Observable<void>;
  unpledgeAction(actionId: string): Observable<void>;
}