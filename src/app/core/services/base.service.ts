import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseService {
  // Controlled via environment config
  protected isMockBackend = environment.mockBackend;

  // Add artificial delay to mock data to simulate network latency
  protected mockDelay = 500;

  protected handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  protected withMockDelay<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.mockDelay));
  }

  protected convertTimestamps<T>(data: any): T {
    if (!data) return data;

    if (data instanceof Array) {
      return data.map(item => this.convertTimestamps(item)) as T;
    }

    if (data instanceof Object) {
      const converted = { ...data };
      for (const key in converted) {
        if (converted[key]?.toDate instanceof Function) {
          converted[key] = converted[key].toDate().toISOString();
        } else if (converted[key] instanceof Object) {
          converted[key] = this.convertTimestamps(converted[key]);
        }
      }
      return converted as T;
    }

    return data;
  }

  protected paginateResponse<T>(
    items: T[],
    page: number,
    pageSize: number
  ): { items: T[]; hasMore: boolean } {
    const start = (page - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);
    return {
      items: paginatedItems,
      hasMore: items.length > start + pageSize
    };
  }

  // Helper method to generate random dates within a range
  protected randomDate(start: Date, end: Date): string {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
  }

  // Helper to get random item from array
  protected randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
