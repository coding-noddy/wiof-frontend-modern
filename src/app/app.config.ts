import { ApplicationConfig } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppTitleStrategy } from './shared/seo/app-title.strategy';

import {
  QUIZ_SERVICE,
  BLOG_SERVICE,
  VIDEO_SERVICE,
  ACTION_SERVICE,
  FOCUS_SERVICE,
  CALENDAR_SERVICE,
} from './core/services/tokens';

import { FirebaseQuizService } from './core/services/firebase/quiz.service';
import { FirebaseBlogService } from './core/services/firebase/blog.service';
import { FirebaseVideoService } from './core/services/firebase/video.service';
import { FirebaseActionService } from './core/services/firebase/action.service';
import { FirebaseFocusService } from './core/services/firebase/focus.service';
import { FirebaseCalendarService } from './core/services/firebase/calendar.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    Title,
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: QUIZ_SERVICE, useClass: FirebaseQuizService },
    { provide: BLOG_SERVICE, useClass: FirebaseBlogService },
    { provide: VIDEO_SERVICE, useClass: FirebaseVideoService },
    { provide: ACTION_SERVICE, useClass: FirebaseActionService },
    { provide: FOCUS_SERVICE, useClass: FirebaseFocusService },
    { provide: CALENDAR_SERVICE, useClass: FirebaseCalendarService },
  ],
};
