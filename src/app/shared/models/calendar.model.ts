export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  type: 'webinar' | 'cleanup' | 'workshop' | 'conference' | 'meetup';
  organizer: string;
  registrationUrl?: string;
  isOnline: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
}

export interface CalendarFilter {
  element?: string;
  type?: string;
  month?: number;
  year?: number;
}
