import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElementBadgeComponent } from './element-badge.component';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  type: 'webinar' | 'cleanup' | 'workshop' | 'conference';
}

@Component({
  selector: 'app-environment-calendar-teaser',
  standalone: true,
  imports: [NgFor, RouterLink, ElementBadgeComponent],
  template: `
    <section class="section">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="section-title">Environment Calendar</h2>
            <p class="section-sub">Upcoming events and activities</p>
          </div>
          <a routerLink="/calendar" class="text-water hover:text-water/80 text-sm font-medium">
            View full calendar
          </a>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Mini calendar -->
          <div class="card p-6">
            <div class="text-center mb-4">
              <h3 class="font-semibold text-lg">{{ currentMonth }}</h3>
              <p class="text-sm text-slate-600">{{ currentYear }}</p>
            </div>
            
            <!-- Simple calendar grid -->
            <div class="grid grid-cols-7 gap-1 text-center text-xs mb-4">
              <div class="font-medium text-slate-500 p-1">S</div>
              <div class="font-medium text-slate-500 p-1">M</div>
              <div class="font-medium text-slate-500 p-1">T</div>
              <div class="font-medium text-slate-500 p-1">W</div>
              <div class="font-medium text-slate-500 p-1">T</div>
              <div class="font-medium text-slate-500 p-1">F</div>
              <div class="font-medium text-slate-500 p-1">S</div>
              
              <!-- Calendar days (simplified) -->
              <div *ngFor="let day of calendarDays" 
                   class="p-1 rounded"
                   [class.bg-water]="day.hasEvent"
                   [class.text-white]="day.hasEvent"
                   [class.font-semibold]="day.isToday">
                {{ day.number }}
              </div>
            </div>
            
            <div class="text-center">
              <a routerLink="/calendar" class="text-water hover:text-water/80 text-sm font-medium">
                View all events →
              </a>
            </div>
          </div>
          
          <!-- Upcoming events -->
          <div class="lg:col-span-2 space-y-4">
            <h4 class="font-semibold text-slate-700">Next 3 Events</h4>
            
            <div class="space-y-3">
              <div *ngFor="let event of upcomingEvents" 
                   class="card p-4 flex items-center gap-4 hover:shadow-md transition">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <span class="text-xs font-semibold text-slate-600">
                      {{ getEventIcon(event.type) }}
                    </span>
                  </div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <app-element-badge [element]="event.element" />
                    <span class="text-xs text-slate-500 capitalize">{{ event.type }}</span>
                  </div>
                  <h5 class="font-medium text-sm leading-tight mb-1">{{ event.title }}</h5>
                  <div class="flex items-center gap-3 text-xs text-slate-500">
                    <span>{{ event.date }} at {{ event.time }}</span>
                    <span>{{ event.location }}</span>
                  </div>
                </div>
                
                <a routerLink="/calendar" class="text-water hover:text-water/80 text-sm">
                  →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class EnvironmentCalendarTeaserComponent {
  currentMonth = 'September';
  currentYear = '2025';
  
  calendarDays = [
    { number: 1, hasEvent: false, isToday: false },
    { number: 2, hasEvent: false, isToday: false },
    { number: 3, hasEvent: true, isToday: true },
    { number: 4, hasEvent: false, isToday: false },
    { number: 5, hasEvent: false, isToday: false },
    { number: 6, hasEvent: false, isToday: false },
    { number: 7, hasEvent: false, isToday: false },
    { number: 8, hasEvent: false, isToday: false },
    { number: 9, hasEvent: false, isToday: false },
    { number: 10, hasEvent: true, isToday: false },
    { number: 11, hasEvent: false, isToday: false },
    { number: 12, hasEvent: false, isToday: false },
    { number: 13, hasEvent: false, isToday: false },
    { number: 14, hasEvent: false, isToday: false },
    { number: 15, hasEvent: true, isToday: false },
    { number: 16, hasEvent: false, isToday: false },
    { number: 17, hasEvent: false, isToday: false },
    { number: 18, hasEvent: false, isToday: false },
    { number: 19, hasEvent: false, isToday: false },
    { number: 20, hasEvent: false, isToday: false },
    { number: 21, hasEvent: false, isToday: false },
    { number: 22, hasEvent: true, isToday: false },
    { number: 23, hasEvent: false, isToday: false },
    { number: 24, hasEvent: false, isToday: false },
    { number: 25, hasEvent: false, isToday: false },
    { number: 26, hasEvent: false, isToday: false },
    { number: 27, hasEvent: false, isToday: false },
    { number: 28, hasEvent: false, isToday: false },
    { number: 29, hasEvent: false, isToday: false },
    { number: 30, hasEvent: false, isToday: false }
  ];

  upcomingEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Ocean Cleanup Workshop',
      date: 'Sep 5',
      time: '10:00 AM',
      location: 'Marina Beach',
      element: 'water',
      type: 'cleanup'
    },
    {
      id: '2', 
      title: 'Renewable Energy Webinar',
      date: 'Sep 10',
      time: '2:00 PM',
      location: 'Online',
      element: 'fire',
      type: 'webinar'
    },
    {
      id: '3',
      title: 'Urban Gardening Workshop',
      date: 'Sep 15',
      time: '9:00 AM',
      location: 'Community Center',
      element: 'earth',
      type: 'workshop'
    }
  ];

  getEventIcon(type: string): string {
    switch (type) {
      case 'webinar': return '💻';
      case 'cleanup': return '🧹';
      case 'workshop': return '🛠️';
      case 'conference': return '🎤';
      default: return '📅';
    }
  }
}
