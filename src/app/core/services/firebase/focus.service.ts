import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { IFocusService } from '../interfaces/focus.service.interface';
import { FocusItem, FocusFilter } from '../../../shared/models/focus.model';

// Mock Data
const MOCK_FOCUS_ITEMS: FocusItem[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `focus-${i + 1}`,
  title: `${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} ${['Initiative', 'Project', 'Innovation', 'Program'][i % 4]}`,
  description: `Leading ${['conservation', 'sustainability', 'innovation', 'education'][i % 4]} efforts in ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} domain.`,
  type: ['ngo', 'firm', 'city', 'innovation', 'course'][Math.floor(i / 8)] as any,
  element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
  imageUrl: `https://picsum.photos/seed/focus${i}/800/600`,
  website: 'https://example.org',
  location: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][i % 5],
  founded: `${2010 + (i % 15)}`,
  metrics: [
    { label: 'Impact Score', value: `${Math.floor(Math.random() * 50) + 50}%` },
    { label: 'Communities', value: `${Math.floor(Math.random() * 100) + 20}+` },
    { label: 'Projects', value: `${Math.floor(Math.random() * 50) + 10}` }
  ],
  actions: [
    'Implemented sustainable practices',
    'Launched community programs',
    'Developed innovative solutions',
    'Educated local communities'
  ],
  featured: i < 8,
  content: 'Detailed content about the initiative would go here...'
}));

@Injectable({
  providedIn: 'root'
})
export class FirebaseFocusService extends BaseService implements IFocusService {
  private db = inject(Firestore);

  getFocusItems(
    page: number,
    pageSize: number,
    filter?: FocusFilter
  ): Observable<{ items: FocusItem[]; total: number }> {
    if (this.isMockBackend) {
      let filteredItems = [...MOCK_FOCUS_ITEMS];

      if (filter?.type && filter.type !== 'all') {
        filteredItems = filteredItems.filter(item => item.type === filter.type);
      }
      if (filter?.element) {
        filteredItems = filteredItems.filter(item => item.element === filter.element);
      }
      if (filter?.featured) {
        filteredItems = filteredItems.filter(item => item.featured);
      }

      const { items } = this.paginateResponse(filteredItems, page, pageSize);
      return this.withMockDelay({ items, total: filteredItems.length });
    }

    const focusCollection = collection(this.db, 'focus');
    let focusQuery = query(focusCollection);

    if (filter?.type && filter.type !== 'all') {
      focusQuery = query(focusQuery, where('type', '==', filter.type));
    }
    if (filter?.element) {
      focusQuery = query(focusQuery, where('element', '==', filter.element));
    }
    if (filter?.featured) {
      focusQuery = query(focusQuery, where('featured', '==', true));
    }

    return from(getDocs(focusQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        const total = snapshot.docs.length;
        const start = (page - 1) * pageSize;
        const items = snapshot.docs
          .slice(start, start + pageSize)
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as FocusItem));
        return { items, total };
      }),
      map(data => this.convertTimestamps<{ items: FocusItem[]; total: number }>(data))
    );
  }

  getFocusItemById(id: string): Observable<FocusItem> {
    if (this.isMockBackend) {
      const item = MOCK_FOCUS_ITEMS.find(i => i.id === id);
      if (!item) {
        return this.handleError(new Error('Focus item not found'));
      }
      return this.withMockDelay(item);
    }

    const focusCollection = collection(this.db, 'focus');
    const focusQuery = query(focusCollection, where('id', '==', id), limit(1));

    return from(getDocs(focusQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          throw new Error('Focus item not found');
        }
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as FocusItem;
      }),
      map(data => this.convertTimestamps<FocusItem>(data))
    );
  }

  getFeaturedItems(element?: string, limitCount?: number): Observable<FocusItem[]> {
    if (this.isMockBackend) {
      let featured = MOCK_FOCUS_ITEMS.filter(i => i.featured);
      if (element) {
        featured = featured.filter(i => i.element === element);
      }
      if (limitCount) {
        featured = featured.slice(0, limitCount);
      }
      return this.withMockDelay(featured);
    }

    const focusCollection = collection(this.db, 'focus');
    let focusQuery = query(focusCollection, where('featured', '==', true));

    if (element) {
      focusQuery = query(focusQuery, where('element', '==', element));
    }
    if (limitCount) {
      focusQuery = query(focusQuery, limit(limitCount));
    }

    return from(getDocs(focusQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as FocusItem))
      ),
      map(data => this.convertTimestamps<FocusItem[]>(data))
    );
  }
}