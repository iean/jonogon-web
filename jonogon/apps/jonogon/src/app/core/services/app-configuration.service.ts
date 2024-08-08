import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApplicationConfiguration } from '../models/app-configuration.model';

/**
 * This service reads apps configuration for different aspects
 */
@Injectable({ providedIn: 'root' })
export class ApplicationConfigurationService {
  static settings: IApplicationConfiguration;
  constructor(private httpClient: HttpClient) {}
  /**
   *
   * @param environmentName environment name in string format
   * @param environment environment object
   * @returns
   */
  load(environmentName: string) {
    const jsonFile = `./assets/configuration/configuration.json`;
    return new Promise<void>((resolve, reject) => {
      this.httpClient
        .get(jsonFile)
        .toPromise()
        .then((response) => {
          const settings = <IApplicationConfiguration>response;
          ApplicationConfigurationService.settings = settings;
          resolve();
        })
        .catch((error) => {
          reject(`Could not load file '${jsonFile}': ${JSON.stringify(error)}`);
        });
    });
  }
}
