import { Observable } from 'rxjs';
import { FocusItem, FocusFilter } from '../../../shared/models/focus.model';

export interface IFocusService {
  getFocusItems(page: number, pageSize: number, filter?: FocusFilter): Observable<{ items: FocusItem[]; total: number }>;
  getFocusItemById(id: string): Observable<FocusItem>;
  getFeaturedItems(element?: string, limit?: number): Observable<FocusItem[]>;
}