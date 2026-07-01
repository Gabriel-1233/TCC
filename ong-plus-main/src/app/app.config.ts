
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Angular Material
import { MatNativeDateModule } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
// NGX-Mask
import { provideNgxMask } from 'ngx-mask';


// Rotas
import { routes } from './app.routes';


registerLocaleData(ptBr)
export const appConfig: ApplicationConfig = {
  providers: [
    // Angular core
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    // Angular Material
    importProvidersFrom(MatNativeDateModule),

    { provide: LOCALE_ID, useValue: 'pt-BR' },

    // Ngx-mask
    provideNgxMask()
  ]
};
