import {
  APP_INITIALIZER,
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  importProvidersFrom,
  inject,
  NgZone,
} from '@angular/core';
import localede from '@angular/common/locales/de';

import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  LocationStrategy,
  PathLocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfigurationService } from './core/services/app-configuration.service';
import { LanguageWrapperService } from './core/services/language-wrapper.service';
import { Language } from './core/models/app-configuration.model';
import { akitaDevtools, DevtoolsOptions, persistState } from '@datorama/akita';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { IdbStorage } from './idb.database';

//load locales
registerLocaleData(localede);

export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Initializes application configuration per environment
 * @param applicationConfigurationService application configuration service
 * @param languageWrapperService language wrapper service
 * @returns application configuration
 */
export function initializeAppWithConfiguration(
  applicationConfigurationService: ApplicationConfigurationService,
  languageWrapperService: LanguageWrapperService
) {
  return () =>
    applicationConfigurationService.load('development').then(() => {
      const appLanguages =
        ApplicationConfigurationService.settings.languageConfig;
      if (
        appLanguages.activated_languages &&
        appLanguages.activated_languages.length
      ) {
        //iterate all the available lang and async pre-load
        appLanguages.activated_languages.forEach((lang: Language) => {
          languageWrapperService.loadLanguage([lang.key]);
        });
      }
    });
}

export function provideAkitaDevtools(options: Partial<DevtoolsOptions> = {}) {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => {
        akitaDevtools(inject(NgZone), options);
      };
    },
  };
}

export const primeNgProviders = [ConfirmationService, DialogService];
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAkitaDevtools(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    TokenInterceptor,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: 'persistStorage',
      useValue: persistState({ storage: new IdbStorage() }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppWithConfiguration,
      deps: [ApplicationConfigurationService, LanguageWrapperService],
      multi: true,
    },
  ],
};
