import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
// InMemoryWebApiModule is an API provided by the Angular team that intercepts our HTTP requests and
// returns pre-defined responses (This allows us to write code that appears to issue an HTTP request)
// and write code to process the returned response
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppData } from './app-data';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // For InMemoryWebApiModule to work properly we need to have the provideHttpClient ahead of InMemory
    provideHttpClient(),
    importProvidersFrom(
      FormsModule,
      // We import the NgModule for the inMemoryWebApi and set a delay of 1 second
      // to provide a more realistic time for the HTTP reponse
      InMemoryWebApiModule.forRoot(AppData, { delay: 1000 })  // we define the AppData in the app-data-ts file
    ),
    provideRouter(routes)
  ]
};
