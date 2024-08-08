import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  const userToken = localStorageService.getUserToken();

  if (userToken) return true;

  router.navigate(['/account'], { queryParams: { returnUrl: state.url } });
  return false;
};
