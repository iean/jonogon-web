import { Injectable } from '@angular/core';
/**
 * This service is used to recognize the Screen
 */
@Injectable({
  providedIn: 'root',
})
export class ScreenTypeService {
  #mobileMedia = window.matchMedia('(width <= 768px)');
  #tabletMedia = window.matchMedia('(768px < width < 992px)');
  #desktopMedia = window.matchMedia('(width >= 992px)');
  #isMobile = this.#mobileMedia.matches;
  #isTablet = this.#tabletMedia.matches;
  #isDesktop = this.#desktopMedia.matches;

  constructor() {
    this.#mobileMedia.addEventListener('change', (e) => {
      this.#isMobile = e.matches;
    });

    this.#tabletMedia.addEventListener('change', (e) => {
      this.#isTablet = e.matches;
    });

    this.#desktopMedia.addEventListener('change', (e) => {
      this.#isDesktop = e.matches;
    });
  }

  public get isMobile() {
    return this.#isMobile;
  }

  public get isTablet() {
    return this.#isTablet;
  }

  public get isDesktop() {
    return this.#isDesktop;
  }
}
