import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ApplicationConfigurationService } from './app-configuration.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class LanguageWrapperService {
  languageSwitched = new Subject<string>();
  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.setDefaultLanguageOnLoad();
  }

  setDefaultLanguageOnLoad() {
    const currentLang =
      this.localStorageService.getCurrentUserLanguage() || 'de';
    this.setToSpecificLanguage(currentLang);
  }

  /**
   * this method loads the appropriate language for the application
   */
  setToDefaultLanguage() {
    // check if the user has already selected a language

    const currentUserSelectedLanguage =
      this.localStorageService.getCurrentUserLanguage();

    const applicationDefaultLanguage =
      ApplicationConfigurationService.settings.languageConfig.default_language;

    this.localStorageService.setApplicationDefaultLanguage(
      applicationDefaultLanguage
    );

    // user has previously selected a language
    if (currentUserSelectedLanguage) {
      this.translateService.use(currentUserSelectedLanguage);
      this.translateService.setDefaultLang(currentUserSelectedLanguage);
    } else {
      if (applicationDefaultLanguage) {
        this.translateService.use(applicationDefaultLanguage);
      }
    }
  }
  /**
   *
   * @param languageCode language code
   *
   * SetToSpecificLanguage('en')
   */
  public setToSpecificLanguage(languageCode: string) {
    this.translateService.use(languageCode);
    this.setCurrentlySelectedLanguageIdForApplication(languageCode);
  }

  /**
   *
   * @param languageCodes list of languages to load
   */
  public loadLanguage(languageCodes: string[]) {
    this.translateService.addLangs(languageCodes);
  }

  /**
   *
   * @returns currently selected language code for the applciation
   */
  public getCurrentlySelectedLanguageId(): string {
    const currentUserSelectedLanguage =
      this.localStorageService.getCurrentUserLanguage();
    if (currentUserSelectedLanguage) return currentUserSelectedLanguage;

    return this.getSupportedUserLocale();
  }

  /**
   *
   * @param currentSelectedLanguageId language id
   */
  public setCurrentlySelectedLanguageIdForApplication(
    currentSelectedLanguageId: string
  ) {
    this.translateService.use(currentSelectedLanguageId);
    this.localStorageService.setCurrentUserLanguage(currentSelectedLanguageId);
  }

  public getTranslation(key: string) {
    return this.translateService.get(key);
  }

  public getInstantTranslation(
    key: string,
    interpolateParams: Record<string, unknown> = {}
  ) {
    return this.translateService.instant(key, interpolateParams);
  }

  /**
   * Format currency according to language preference
   */
  public formatCurrency(value: number) {
    const currentLang = this.getCurrentlySelectedLanguageId();
    return new Intl.NumberFormat(currentLang, {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

  /**
   * Get the user's locale if it is supported, or English (en) otherwise.
   * @returns language key
   */
  getSupportedUserLocale() {
    const userLocale = navigator.language.split('-')[0];
    const supportedLocales =
      ApplicationConfigurationService.settings.languageConfig.activated_languages.map(
        (lang) => lang.key
      );
    return supportedLocales.includes(userLocale) ? userLocale : 'en';
  }
}
