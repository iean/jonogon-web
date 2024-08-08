import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  /**
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  /**
   *
   * @param currentLanguageKey set language as current language
   */
  setCurrentUserLanguage(currentLanguageKey: string) {
    localStorage.setItem('currentLanguage', currentLanguageKey);
  }

  /**
   *
   * @returns current user language key
   */
  getCurrentUserLanguage() {
    return localStorage.getItem('currentLanguage');
  }

  setApplicationDefaultLanguage(defaultLanguage: string) {
    localStorage.setItem('defaultLanguage', defaultLanguage);
  }

  getApplicationDefaultLanguage() {
    return localStorage.getItem('defaultLanguage');
  }

  /**
   * get
   */

  getUserToken() {
    return localStorage.getItem('accessToken');
  }

  setUserToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  setUserData(userData: unknown) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  getUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) return JSON.parse(currentUser);
    else return null;
  }
}
