import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ApplicationConfigurationService } from '../services/app-configuration.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<unknown> =
    new BehaviorSubject<unknown>(null);

  constructor(private _httpClient: HttpClient, private _router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const company = JSON.parse(localStorage.getItem('company')!);
    let host;
    if (company) host = company.company.company_host;

    request.headers.set('access_token', localStorage.getItem('accessToken')!);
    request.headers.set('X-Tenant-ID', host);
    request.headers.set('X-Platform', Capacitor.getPlatform());

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 406) {
          return this.handle406Error(request, next);
        } else if (error instanceof HttpErrorResponse && error.status === 401) {
          // Redirect to login if refresh_token gave 401
          return this.handle401Error();
        } else {
          this.isRefreshing = false;
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string) {
    const company = JSON.parse(localStorage.getItem('company')!);
    let host;
    if (company) host = company.company.company_host;

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Tenant-ID': host,
        'X-Platform': Capacitor.getPlatform(),
      },
    });
  }
  getRefreshToken() {
    const baseUrl = ApplicationConfigurationService.settings.apiConfig.baseUrl;
    return this._httpClient.post(
      baseUrl + 'user/refresh',
      {
        auth_token: localStorage.getItem('accessToken'),
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('refreshToken'),
        },
      }
    );
  }
  private handle406Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.getRefreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token['data'].access_token);
          localStorage.setItem('accessToken', token['data'].access_token);
          return next.handle(
            this.addToken(request, token['data'].access_token)
          );
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt: any) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private handle401Error() {
    const pathExclusionList = [
      '/account/get-started',
      '/account/verify-email',
      '/account/verify',
      '/account/accept-invite',
      '/account/forgot-password',
      '/account/reset',
      '/account/subscription',
      'user/qrcode/qrcode-details',
    ];
    const currentPath = window.location.pathname;
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);
    if (
      pathExclusionList.findIndex((path) => currentPath.includes(path)) === -1
    ) {
      this._router.navigate(['account', 'get-started']);
    }
    return throwError(() => new Error('Session Expired'));
  }
}

export const TokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtTokenInterceptor,
  multi: true,
};
