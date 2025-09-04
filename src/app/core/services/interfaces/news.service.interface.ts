import { Observable } from 'rxjs';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  element?: 'earth' | 'water' | 'fire' | 'air' | 'space';
  isBreaking: boolean;
  source?: {
    name: string;
    url: string;
  };
}

export interface INewsService {
  getBreakingNews(): Observable<NewsItem[]>;
  
  getLatestNews(limit: number): Observable<NewsItem[]>;
  
  getNewsByElement(
    element: string,
    page: number,
    pageSize: number
  ): Observable<{ news: NewsItem[]; hasMore: boolean }>;
  
  getNewsById(id: string): Observable<NewsItem>;
  
  getRelatedNews(newsId: string, limit: number): Observable<NewsItem[]>;
}