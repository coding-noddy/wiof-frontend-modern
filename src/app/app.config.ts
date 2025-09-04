import { ApplicationConfig } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppTitleStrategy } from './shared/seo/app-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    Title,
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
