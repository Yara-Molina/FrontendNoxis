import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule, JWT_OPTIONS, JwtModuleOptions, JwtHelperService} from '@auth0/angular-jwt';

export function jwtOptionsFactory(): JwtModuleOptions {
  return {
    config: {
      tokenGetter: () => localStorage.getItem('token'),
      allowedDomains: [], // Puedes añadir dominios si usas HttpInterceptor
      disallowedRoutes: []
    }
  };
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(), 
    provideAnimationsAsync(), provideAnimationsAsync(),
    provideAnimations(), provideAnimationsAsync(),
    {
      provide: JWT_OPTIONS,
      useFactory: jwtOptionsFactory
    },
    JwtHelperService
  
  ]
};