import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { ICalendarService } from '../interfaces/calendar.service.interface';
import { CalendarEvent, CalendarFilter } from '../../../shared/models/calendar.model';

// Mock Data
const MOCK_EVENTS: CalendarEvent[] = Array.from({ length: 50 }).map((_, i) => {
  const eventDate = new Date(2025, Math.floor(i / 15), (i % 28) + 1);
  const eventHour = 9 + (i % 8); // Events between 9 AM and 5 PM
  return {
    id: `event-${i + 1}`,
    title: `${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} ${['Conference', 'Workshop', 'Seminar', 'Action Day'][i % 4]}`,
    description: `Join us for an engaging ${['conference', 'workshop', 'seminar', 'action day'][i % 4]} focused on ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]}.`,
    date: eventDate.toISOString().split('T')[0],
    time: `${eventHour}:00`,
    endTime: `${eventHour + 2}:00`,
    location: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][i % 5],
    element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as 'earth' | 'water' | 'fire' | 'air' | 'space',
    type: (['webinar', 'cleanup', 'workshop', 'conference', 'meetup'][i % 5]) as 'webinar' | 'cleanup' | 'workshop' | 'conference' | 'meetup',
    organizer: ['Green Earth Foundation', 'Water Warriors', 'Clean Energy Alliance', 'Air Quality Initiative', 'Global Unity'][i % 5],
    registrationUrl: 'https://example.org/register',
    isOnline: i % 3 === 0,
    maxParticipants: 500,
    currentParticipants: Math.floor(Math.random() * 500)
  };
});

@Injectable({
  providedIn: 'root'
})
export class FirebaseCalendarService extends BaseService implements ICalendarService {
  private db = inject(Firestore);

  getEvents(
    year: number,
    month: number,
    filters?: CalendarFilter
  ): Observable<CalendarEvent[]> {
    if (this.isMockBackend) {
      let filteredEvents = MOCK_EVENTS.filter(event => {
        const eventDate = new Date(event.date);
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
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
