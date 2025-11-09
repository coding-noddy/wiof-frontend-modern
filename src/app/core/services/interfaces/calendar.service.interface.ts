import { Observable } from 'rxjs';
import { CalendarEvent, CalendarFilter } from '../../../shared/models/calendar.model';

export interface ICalendarService {
  getEvents(
    year: number,
    month: number,
    filters?: CalendarFilter
  ): Observable<CalendarEvent[]>;

  getEventById(id: string): Observable<CalendarEvent>;

  getUpcomingEvents(limit: number): Observable<CalendarEvent[]>;

  addEventToCalendar(eventId: string): Observable<void>;
  removeEventFromCalendar(eventId: string): Observable<void>;

  getUserEvents(): Observable<CalendarEvent[]>;
}
