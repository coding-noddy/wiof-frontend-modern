import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map, mergeMap } from 'rxjs';
import { BaseService } from '../base.service';
import { INewsService, NewsItem } from '../interfaces/news.service.interface';

// Mock data for development/testing
const MOCK_NEWS: NewsItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `news-${i + 1}`,
  title: `Environmental Alert ${i + 1}`,
  content: `Detailed content about environmental event ${i + 1}...`,
  summary: `Brief summary of environmental event ${i + 1}`,
  imageUrl: `https://source.unsplash.com/800x400/?nature,environment&sig=${i}`,
  publishedAt: new Date(2025, Math.floor(i / 2), (i % 28) + 1).toISOString(),
  element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
  isBreaking: i < 3,
  source: {
    name: 'Environmental News Network',
    url: 'https://www.enn.com'
  }
}));

@Injectable({
  providedIn: 'root'
})
export class FirebaseNewsService extends BaseService implements INewsService {
  private db = inject(Firestore);

  getBreakingNews(): Observable<NewsItem[]> {
    if (this.isMockBackend) {
      return this.withMockDelay(MOCK_NEWS.filter(news => news.isBreaking));
    }

    const newsCollection = collection(this.db, 'news');
    const newsQuery = query(
      newsCollection,
      where('isBreaking', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );

    return from(getDocs(newsQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NewsItem))
      ),
      map(data => this.convertTimestamps<NewsItem[]>(data))
    );
  }

  getLatestNews(limitCount: number): Observable<NewsItem[]> {
    if (this.isMockBackend) {
      return this.withMockDelay(MOCK_NEWS.slice(0, limitCount));
    }

    const newsCollection = collection(this.db, 'news');
    const newsQuery = query(
      newsCollection,
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    return from(getDocs(newsQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NewsItem))
      ),
      map(data => this.convertTimestamps<NewsItem[]>(data))
    );
  }

  getNewsByElement(
    element: string,
    page: number,
    pageSize: number
  ): Observable<{ news: NewsItem[]; hasMore: boolean }> {
    if (this.isMockBackend) {
      const filteredNews = MOCK_NEWS.filter(item => item.element === element);
      const { items, hasMore } = this.paginateResponse(filteredNews, page, pageSize);
      return this.withMockDelay({ news: items, hasMore });
    }

    const newsCollection = collection(this.db, 'news');
    const newsQuery = query(
      newsCollection,
      where('element', '==', element),
      orderBy('publishedAt', 'desc'),
      limit(pageSize + 1)
    );

    return from(getDocs(newsQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NewsItem))
      ),
      map(data => this.convertTimestamps<NewsItem[]>(data)),
      map(items => ({
        news: items.slice(0, pageSize),
        hasMore: items.length > pageSize
      }))
    );
  }

  getNewsById(id: string): Observable<NewsItem> {
    if (this.isMockBackend) {
      const newsItem = MOCK_NEWS.find(item => item.id === id);
      if (!newsItem) {
        throw new Error('News item not found');
      }
      return this.withMockDelay(newsItem);
    }

    const newsCollection = collection(this.db, 'news');
    const docRef = doc(newsCollection, id);

    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('News item not found');
        }
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as NewsItem;
      }),
      map(data => this.convertTimestamps<NewsItem>(data))
    );
  }  getRelatedNews(newsId: string, limitCount: number): Observable<NewsItem[]> {
    if (this.isMockBackend) {
      const newsItem = MOCK_NEWS.find(item => item.id === newsId);
      if (!newsItem) {
        return this.withMockDelay([]);
      }
      return this.withMockDelay(
        MOCK_NEWS.filter(
          item => item.element === newsItem.element && item.id !== newsId
        ).slice(0, limitCount)
      );
    }

    return this.getNewsById(newsId).pipe(
      map(news => news.element),
      map(element => {
        const newsCollection = collection(this.db, 'news');
        return query(
          newsCollection,
          where('element', '==', element),
          where('id', '!=', newsId),
          orderBy('publishedAt', 'desc'),
          limit(limitCount)
        );
      }),
      map(queryRef => getDocs(queryRef)),
      mergeMap(promise => from(promise)),
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NewsItem))
      ),
      map(data => this.convertTimestamps<NewsItem[]>(data))
    );
  }
}
