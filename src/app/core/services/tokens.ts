import { InjectionToken } from '@angular/core';
import { IQuizService } from './interfaces/quiz.service.interface';
import { IBlogService } from './interfaces/blog.service.interface';
import { IVideoService } from './interfaces/video.service.interface';
import { IActionService } from './interfaces/action.service.interface';
import { IFocusService } from './interfaces/focus.service.interface';
import { ICalendarService } from './interfaces/calendar.service.interface';
import { INewsService } from './interfaces/news.service.interface';

export const QUIZ_SERVICE = new InjectionToken<IQuizService>('QuizService');
export const BLOG_SERVICE = new InjectionToken<IBlogService>('BlogService');
export const VIDEO_SERVICE = new InjectionToken<IVideoService>('VideoService');
export const ACTION_SERVICE = new InjectionToken<IActionService>('ActionService');
export const FOCUS_SERVICE = new InjectionToken<IFocusService>('FocusService');
export const CALENDAR_SERVICE = new InjectionToken<ICalendarService>('CalendarService');
export const NEWS_SERVICE = new InjectionToken<INewsService>('NewsService');
