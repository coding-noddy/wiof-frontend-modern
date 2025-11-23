import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementBadgeComponent } from '../../shared/ui/element-badge.component';
import { CalendarEvent } from '../../shared/models/calendar.model';
import { JsonLdService } from '../../shared/seo/json-ld.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, ElementBadgeComponent, TitleCasePipe],
  template: `
    <section class="section">
      <div class="container">
        <div class="text-center mb-8">
          <h1 class="section-title">Environment Calendar</h1>
          <p class="section-sub">Discover events, workshops, and activities near you</p>
        </div>

        <!-- View Toggle and Filters -->
        <div class="card p-6 mb-8">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <!-- View Toggle -->
            <div class="flex rounded-xl border border-slate-300 overflow-hidden">
              <button
                (click)="setViewMode('calendar')"
                class="px-4 py-2 text-sm font-medium transition"
                [ngClass]="{
                  'bg-water text-white': viewMode() === 'calendar',
                  'hover:bg-slate-50': viewMode() !== 'calendar'
                }">
                Calendar View
              </button>
              <button
                (click)="setViewMode('list')"
                class="px-4 py-2 text-sm font-medium transition"
                [ngClass]="{
                  'bg-water text-white': viewMode() === 'list',
                  'hover:bg-slate-50': viewMode() !== 'list'
                }">
                List View
              </button>
            </div>

            <!-- Export Button -->
            <button
              (click)="exportCalendar()"
              class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-medium transition"
            >
              Export Calendar
            </button>
          </div>

          <!-- Filters -->
          <div class="grid md:grid-cols-3 gap-4">
            <select
              [(ngModel)]="selectedElement"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Elements</option>
              <option value="earth">Earth</option>
              <option value="water">Water</option>
              <option value="fire">Fire</option>
              <option value="air">Air</option>
              <option value="space">Space</option>
            </select>

            <select
              [(ngModel)]="selectedType"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Types</option>
              <option value="webinar">Webinars</option>
              <option value="cleanup">Cleanups</option>
              <option value="workshop">Workshops</option>
              <option value="conference">Conferences</option>
              <option value="meetup">Meetups</option>
            </select>

            <select
              [(ngModel)]="selectedMonth"
              (change)="updateFilters()"
              class="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-water focus:border-water"
            >
              <option value="">All Months</option>
              <option value="9">September 2025</option>
              <option value="10">October 2025</option>
              <option value="11">November 2025</option>
              <option value="12">December 2025</option>
            </select>
          </div>
        </div>

        <!-- Calendar View -->
        <div *ngIf="viewMode() === 'calendar'" class="card p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">{{ currentMonthName() }} {{ currentYear() }}</h2>
            <div class="flex gap-2">
              <button
                (click)="previousMonth()"
                class="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                ←
              </button>
              <button
                (click)="nextMonth()"
                class="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                →
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 mb-4">
            <div *ngFor="let day of weekDays" class="p-3 text-center text-sm font-medium text-slate-500">
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <div *ngFor="let day of calendarDays()"
                 class="min-h-[100px] p-2 border border-slate-100 rounded-lg"
                 [ngClass]="{
                   'bg-slate-50': !day.isCurrentMonth,
                   'bg-water/5 border-water/20': day.isToday
                 }">
              <div class="text-sm font-medium mb-1"
                   [ngClass]="{
                     'text-slate-400': !day.isCurrentMonth,
                     'text-water font-bold': day.isToday
                   }">
                {{ day.number }}
              </div>
              <div class="space-y-1">
                <div *ngFor="let event of day.events"
                     class="text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm transition"
                     [ngClass]="getEventColorClass(event.element)"
                     [title]="event.title + ' at ' + event.time">
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div *ngIf="viewMode() === 'list'" class="space-y-6">
          <div *ngFor="let event of filteredEvents()" class="card p-6 hover:shadow-md transition">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 text-center">
                <div class="text-2xl font-bold text-water">{{ getEventDay(event.date) }}</div>
                <div class="text-sm text-slate-500">{{ getEventMonth(event.date) }}</div>
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <app-element-badge [element]="event.element" />
                  <span class="text-sm px-2 py-1 rounded-full"
                        [ngClass]="getTypeColorClass(event.type)">
                    {{ event.type | titlecase }}
                  </span>
                  <span *ngIf="event.isOnline" class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Online
                  </span>
                </div>

                <h3 class="font-semibold text-lg mb-2">{{ event.title }}</h3>
                <p class="text-slate-600 mb-3">{{ event.description }}</p>

                <div class="grid sm:grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-500">📅</span>
                    <span>{{ formatEventDate(event.date) }} at {{ event.time }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-500">📍</span>
                    <span>{{ event.location }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-500">👤</span>
                    <span>{{ event.organizer }}</span>
                  </div>
                  <div *ngIf="event.maxParticipants" class="flex items-center gap-2">
                    <span class="text-slate-500">👥</span>
                    <span>{{ event.currentParticipants || 0 }}/{{ event.maxParticipants }} registered</span>
                  </div>
                </div>
              </div>

              <div class="flex-shrink-0">
                <button
                  *ngIf="event.registrationUrl"
                  class="px-4 py-2 rounded-xl bg-water text-white text-sm font-medium hover:bg-water/90 transition"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Events Message -->
        <div *ngIf="filteredEvents().length === 0" class="text-center py-12">
          <div class="text-slate-400 text-6xl mb-4">📅</div>
          <h3 class="text-xl font-semibold text-slate-600 mb-2">No events found</h3>
          <p class="text-slate-500">Try adjusting your filters to see more events.</p>
        </div>
      </div>
    </section>
  `,
})
export class CalendarComponent {
  private jsonld = inject(JsonLdService);
  viewMode = signal<'calendar' | 'list'>('calendar');
  currentMonth = signal(9);
  currentYear = signal(2025);
  selectedElement = '';
  selectedType = '';
  selectedMonth = '';

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {
    // initialize JSON-LD on first render
    setTimeout(() => this.updateJsonLd());
  }

  allEvents = signal<CalendarEvent[]>([
    {
      id: '1',
      title: 'Ocean Cleanup Workshop',
      description: 'Join us for a hands-on workshop about marine conservation and plastic pollution.',
      date: '2025-09-05',
      time: '10:00 AM',
      endTime: '2:00 PM',
      location: 'Marina Beach, Chennai',
      element: 'water',
      type: 'cleanup',
      organizer: 'Ocean Warriors NGO',
      registrationUrl: 'https://example.com/register',
      isOnline: false,
      maxParticipants: 50,
      currentParticipants: 32
    },
    {
      id: '2',
      title: 'Renewable Energy Webinar',
      description: 'Learn about the latest developments in solar and wind energy technologies.',
      date: '2025-09-10',
      time: '2:00 PM',
      endTime: '3:30 PM',
      location: 'Online',
      element: 'fire',
      type: 'webinar',
      organizer: 'Green Tech Institute',
      registrationUrl: 'https://example.com/register',
      isOnline: true,
      maxParticipants: 200,
      currentParticipants: 156
    },
    {
      id: '3',
      title: 'Urban Gardening Workshop',
      description: 'Discover how to create sustainable gardens in urban environments.',
      date: '2025-09-15',
      time: '9:00 AM',
      endTime: '12:00 PM',
      location: 'Community Center, Bangalore',
      element: 'earth',
      type: 'workshop',
      organizer: 'Urban Green Initiative',
      registrationUrl: 'https://example.com/register',
      isOnline: false,
      maxParticipants: 30,
      currentParticipants: 18
    },
    {
      id: '4',
      title: 'Air Quality Monitoring Conference',
      description: 'Annual conference on air pollution monitoring and mitigation strategies.',
      date: '2025-09-22',
      time: '9:00 AM',
      endTime: '5:00 PM',
      location: 'Convention Center, Delhi',
      element: 'air',
      type: 'conference',
      organizer: 'Clean Air Coalition',
      registrationUrl: 'https://example.com/register',
      isOnline: false,
      maxParticipants: 500,
      currentParticipants: 387
    },
    {
      id: '5',
      title: 'Mindful Nature Walk',
      description: 'Connect with nature through guided mindfulness and meditation practices.',
      date: '2025-09-28',
      time: '6:00 AM',
      endTime: '8:00 AM',
      location: 'Lalbagh Botanical Garden',
      element: 'space',
      type: 'meetup',
      organizer: 'Mindful Earth Community',
      isOnline: false,
      maxParticipants: 25,
      currentParticipants: 12
    }
  ]);

  currentMonthName = computed(() => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.currentMonth() - 1];
  });

  filteredEvents = computed(() => {
    let events = this.allEvents();

    if (this.selectedElement) {
      events = events.filter(event => event.element === this.selectedElement);
    }

    if (this.selectedType) {
      events = events.filter(event => event.type === this.selectedType);
    }

    if (this.selectedMonth) {
      const month = parseInt(this.selectedMonth);
      events = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() + 1 === month;
      });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month - 1, 1);
  // const lastDay = new Date(year, month, 0); // not used; kept calculation minimal
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEvents = this.filteredEvents().filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });

      days.push({
        number: date.getDate(),
        isCurrentMonth: date.getMonth() === month - 1,
        isToday: date.toDateString() === today.toDateString(),
        events: dayEvents
      });
    }

    return days;
  });

  setViewMode(mode: 'calendar' | 'list') {
    this.viewMode.set(mode);
    this.updateJsonLd();
  }

  previousMonth() {
    if (this.currentMonth() === 1) {
      this.currentMonth.set(12);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
    this.updateJsonLd();
  }

  nextMonth() {
    if (this.currentMonth() === 12) {
      this.currentMonth.set(1);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
    this.updateJsonLd();
  }

  updateFilters() {
    this.updateJsonLd();
  }

  exportCalendar() {
    const events = this.filteredEvents();
    const icsContent = this.generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'environmental-events.ics';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  generateICS(events: CalendarEvent[]): string {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WIOF//Environmental Calendar//EN\n';

    events.forEach(event => {
      const startDate = new Date(event.date + 'T' + this.convertTo24Hour(event.time));
      const endDate = event.endTime ?
        new Date(event.date + 'T' + this.convertTo24Hour(event.endTime)) :
        new Date(startDate.getTime() + 60 * 60 * 1000);

      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${event.id}@wiof.org\n`;
      ics += `DTSTART:${this.formatICSDate(startDate)}\n`;
      ics += `DTEND:${this.formatICSDate(endDate)}\n`;
      ics += `SUMMARY:${event.title}\n`;
      ics += `DESCRIPTION:${event.description}\n`;
      ics += `LOCATION:${event.location}\n`;
      ics += 'END:VEVENT\n';
    });

    ics += 'END:VCALENDAR';
    return ics;
  }

  convertTo24Hour(time: string): string {
  const [timePart, period] = time.split(' ');
  const parts = timePart.split(':');
  let hours = parts[0];
  const minutes = parts[1];

    if (period === 'PM' && hours !== '12') {
      hours = (parseInt(hours) + 12).toString();
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}:00`;
  }

  formatICSDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  // Update Events JSON-LD for filtered events (list or calendar)
  updateJsonLd() {
    const events = this.filteredEvents();
    const graph = events.map(e => {
      const start = new Date(`${e.date}T${this.convertTo24Hour(e.time)}`);
      const end = e.endTime
        ? new Date(`${e.date}T${this.convertTo24Hour(e.endTime)}`)
        : new Date(start.getTime() + 60 * 60 * 1000);
      return {
        '@type': 'Event',
        name: e.title,
        description: e.description,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        eventAttendanceMode: e.isOnline ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: e.location },
        organizer: { '@type': 'Organization', name: e.organizer },
      };
    });
    this.jsonld.setJsonLd('ld-events', { '@context': 'https://schema.org', '@graph': graph });
  }

  getEventColorClass(element: string): string {
    const colors = {
      earth: 'bg-earth/10 text-earth border-earth/20',
      water: 'bg-water/10 text-water border-water/20',
      fire: 'bg-fire/10 text-fire border-fire/20',
      air: 'bg-air/10 text-air border-air/20',
      space: 'bg-space/10 text-space border-space/20'
    };
    return colors[element as keyof typeof colors] || 'bg-slate-100 text-slate-600';
  }

  getTypeColorClass(type: string): string {
    const colors = {
      webinar: 'bg-blue-100 text-blue-700',
      cleanup: 'bg-green-100 text-green-700',
      workshop: 'bg-purple-100 text-purple-700',
      conference: 'bg-orange-100 text-orange-700',
      meetup: 'bg-pink-100 text-pink-700'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-600';
  }

  getEventDay(dateString: string): string {
    return new Date(dateString).getDate().toString();
  }

  getEventMonth(dateString: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date(dateString).getMonth()];
  }

  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
