/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, signal } from '@angular/core';

/**
 * Showing loaders when needed in the application
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public readonly loaderText = signal('Loading...');
  public readonly isLoaderVisible = signal(false);

  constructor() {}

  /**
   * Start loader with default message
   */
  public startLoader() {
    this.loaderText.set('Loading...');
    this.isLoaderVisible.set(true);
  }

  /**
   * Stop loader
   */
  public stopLoader() {
    this.isLoaderVisible.set(false);
  }

  /**
   * Start loader with custom message
   */
  public startLoaderWithMessage(message: string) {
    this.loaderText.set(message);
    this.isLoaderVisible.set(true);
  }
}
