import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { ICalendarService } from '../interfaces/calendar.service.interface';
import { CalendarEvent, EventFilter } from '../../../shared/models/calendar.model';

// Mock Data
const MOCK_EVENTS: CalendarEvent[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `event-${i + 1}`,
  title: `${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} ${['Conference', 'Workshop', 'Seminar', 'Action Day'][i % 4]}`,
  description: `Join us for an engaging ${['conference', 'workshop', 'seminar', 'action day'][i % 4]} focused on ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]}.`,
  startDate: new Date(2025, Math.floor(i / 15), (i % 28) + 1).toISOString(),
  endDate: new Date(2025, Math.floor(i / 15), (i % 28) + 1 + Math.floor(Math.random() * 3)).toISOString(),
  location: {
    name: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][i % 5],
    virtual: i % 3 === 0
  },
  type: ['conference', 'workshop', 'seminar', 'action'][i % 4],
  element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
  organizer: {
    name: ['Green Earth Foundation', 'Water Warriors', 'Clean Energy Alliance', 'Air Quality Initiative', 'Global Unity'][i % 5],
    website: 'https://example.org'
  },
  featured: i < 10,
  participants: Math.floor(Math.random() * 500) + 50
}));

@Injectable({
  providedIn: 'root'
})
export class FirebaseCalendarService extends BaseService implements ICalendarService {
  private db = inject(Firestore);

  getEvents(
    year: number,
    month: number,
    filters?: EventFilter
  ): Observable<CalendarEvent[]> {
    if (this.isMockBackend) {
      let filteredEvents = MOCK_EVENTS.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
      });

      if (filters?.element) {
        filteredEvents = filteredEvents.filter(e => e.element === filters.element);
      }
      if (filters?.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filters.type);
      }

      return this.withMockDelay(filteredEvents);
    }

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const eventCollection = collection(this.db, 'events');
    let eventQuery = query(
      eventCollection,
      where('startDate', '>=', startDate),
      where('startDate', '<=', endDate)
    );

    if (filters?.element) {
      eventQuery = query(eventQuery, where('element', '==', filters.element));
    }
    if (filters?.type) {
      eventQuery = query(eventQuery, where('type', '==', filters.type));
    }

    return from(getDocs(eventQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CalendarEvent))
      ),
      map(data => this.convertTimestamps<CalendarEvent[]>(data))
    );
  }

  getEventById(id: string): Observable<CalendarEvent> {
    if (this.isMockBackend) {
      const event = MOCK_EVENTS.find(e => e.id === id);
      if (!event) {
        return this.handleError(new Error('Event not found'));
      }
      return this.withMockDelay(event);
    }

    const eventCollection = collection(this.db, 'events');
    const eventQuery = query(eventCollection, where('id', '==', id), limit(1));

    return from(getDocs(eventQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          throw new Error('Event not found');
        }
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as CalendarEvent;
      }),
      map(data => this.convertTimestamps<CalendarEvent>(data))
    );
  }

  getUpcomingEvents(limitCount: number): Observable<CalendarEvent[]> {
    if (this.isMockBackend) {
      const now = new Date();
      const upcoming = MOCK_EVENTS
        .filter(e => new Date(e.startDate) > now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, limitCount);
      return this.withMockDelay(upcoming);
    }

    const now = new Date();
    const eventCollection = collection(this.db, 'events');
    const eventQuery = query(
      eventCollection,
      where('startDate', '>=', now),
      orderBy('startDate'),
      limit(limitCount)
    );

    return from(getDocs(eventQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CalendarEvent))
      ),
      map(data => this.convertTimestamps<CalendarEvent[]>(data))
    );
  }

  addEventToCalendar(eventId: string): Observable<void> {
    if (this.isMockBackend) {
      console.log('Mock: Adding event to calendar', eventId);
      return this.withMockDelay(void 0);
    }

    // Implement Firebase add to user's calendar
    return from(Promise.resolve());
  }

  removeEventFromCalendar(eventId: string): Observable<void> {
    if (this.isMockBackend) {
      console.log('Mock: Removing event from calendar', eventId);
      return this.withMockDelay(void 0);
    }

    // Implement Firebase remove from user's calendar
    return from(Promise.resolve());
  }

  getUserEvents(): Observable<CalendarEvent[]> {
    if (this.isMockBackend) {
      const userEvents = MOCK_EVENTS
        .filter((_, i) => i % 5 === 0) // Simulate some events being in user's calendar
        .slice(0, 5);
      return this.withMockDelay(userEvents);
    }

    // Implement Firebase get user's saved events
    return from(Promise.resolve([]));
  }
}