import { inject, Injectable } from '@angular/core';
import { LocalStorage } from '../helpers/local-storage';
import { ROUTES } from '../../core/routes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);

  logout() {
    LocalStorage.clearAuthToken();
    LocalStorage.clearRefreshToken();

    this.router.navigateByUrl(ROUTES.LOGIN, { replaceUrl: true });
  }
}
