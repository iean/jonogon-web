import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ApplicationConfigurationService } from '../services/app-configuration.service';
import { mergeRoutePaths } from '../utils/route.helper';
import { LocalStorageService } from '../services/local-storage.service';

/**
 * A basic class which may help you write request call very easily
 */
@Injectable({ providedIn: 'root' })
export class BaseDataService {
  private localStorageService = inject(LocalStorageService);
  protected httpClient = inject(HttpClient);
  apiConfiguration = ApplicationConfigurationService.settings.apiConfig;

  /**
   *
   * @returns prepares headers for the request
   */
  protected getHttpHeaders(isMultiPart: boolean) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      /*'X-AppName': 'BaseApp',
      'X-AppVersion': 'X-AppVersion',
      'X-Lokale': 'de',*/
    });
    if (isMultiPart) {
      headers.append('Content-Type', 'multipart/form-data');
    } else {
      headers.append('Content-Type', 'application/json');
    }
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }

  /**
   *
   * @param requestObject request object that needs to be sent to the server
   * @returns form data object with every key in the request object
   */
  protected prepareFormDataWithUserPrefix(
    requestObject: Record<string, Blob | string>
  ) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(requestObject)) {
      formData.append('user[' + key + ']', value);
    }
    return formData;
  }

  /**
   *
   * @param requestObject request object that needs to be sent to the server
   * @returns
   */
  protected prepareRawFormData(
    requestObject: Record<string, unknown>,
    reqObject?: { customer_id: string; subscription_id: string }
  ) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(requestObject)) {
      formData.append(key, value as string);
    }
    if (reqObject) {
      for (const [key, value] of Object.entries(reqObject)) {
        formData.append(key, value);
      }
    }
    return formData;
  }

  /**
   *
   * @param isMultiPart is request should send data using multipart format
   * @param isAuthorized is request should send authorization header
   * @param observeResponse do we have to monitor for response changes , as the request may not send json data all the time
   * @returns
   */
  protected getHttpOptions(
    isMultiPart: boolean,
    isAuthorized: boolean,
    observeResponse: boolean,
    overrideDepartment?: string
  ) {
    let httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
      'observe?': 'response',
    };
    if (observeResponse) {
      httpOptions = {
        headers: new HttpHeaders(),
        params: new HttpParams(),
        'observe?': 'response',
      };
    }

    let headers = this.getHttpHeaders(isMultiPart);
    headers = headers.set('X-Platform', Capacitor.getPlatform());
    //will fetch from akita store
    const company = JSON.parse(localStorage.getItem('company')!);
    let host, department;
    if (company) host = company.company.company_host;
    if (company) {
      const departments = company.departments;
      if (departments && departments.length > 0) {
        department = company.departments[0]?.department?.id; // Only took the first department as this header will only be used if there is one department
      }
    }
    if (host) {
      headers = headers.set('X-Tenant-ID', host);
    }
    if (department) {
      headers = headers.set('Department-Id', department);
    }
    if (overrideDepartment) {
      headers = headers.set('Department-Id', overrideDepartment);
    }
    if (isAuthorized) {
      headers = headers.set(
        'Authorization',
        'Bearer ' + this.localStorageService.getUserToken()
      );
      // console.log(this.authorizationService.getCurrentUserToken());
    }
    let currentLanguage = localStorage.getItem('currentLanguage');

    if (!currentLanguage) {
      currentLanguage = 'de';
    }
    headers = headers.set('Accept-Language', currentLanguage);
    headers.set('Access-Control-Allow-Origin', '*');
    //set headers
    httpOptions.headers = headers;
    return httpOptions;
  }

  /**
   *
   * @param url specific url endpoint like (users/sign_in)
   * @returns full api url like http://test-api/v1/api/users/sign_in
   */
  protected getFullApiUrl(url: string, module: string) {
    const apiBaseUrl = this.apiConfiguration.baseUrl;
    const totalUrl = mergeRoutePaths([apiBaseUrl, module, url]);

    return totalUrl;
    //return mergeRoutePaths([apiBaseUrl,module, AppRouteUrlConstant.ROUTE_API, apiVersion, url]);
  }

  /**
   *
   * @param url Primary path of the api. Avoid / at the beginning and end of the url
   * @param module Module of the api. Avoid / at the beginning and end of the url
   * @param service Service of the api
   * @returns Full url of the api
   */
  protected getServiceUrl(
    url: string,
    module: string,
    service: 'qm' | 'marketplace' | 'calender'
  ): string {
    const baseURL =
      new URL(service, this.apiConfiguration.servicesUrl).href + '/';
    if (url.length == 0) return new URL(`${module}/`, baseURL).href;
    return new URL(`${module}/${url}/`, baseURL).href;
  }

  /**
   *
   * @param url Primary path of the api. Avoid / at the beginning and end of the url
   * @param module Module of the api. Avoid / at the beginning and end of the url
   * @param service Service of the api
   * @returns Full url of the api
   */
  protected getServiceUrl2(url: string, module: string): string {
    const baseURL = new URL(this.apiConfiguration.servicesUrl).href;
    if (url.length == 0) return new URL(`${module}/`, baseURL).href;
    return new URL(`${module}/${url}`, baseURL).href;
  }
}
