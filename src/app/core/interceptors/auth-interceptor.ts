import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BYPASS_AUTH } from '../helpers/auth-context.token';
import { LocalStorage } from '../../shared/helpers/local-storage';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  router = inject(Router);
  authService = inject(AuthService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.context.get(BYPASS_AUTH)) {
      return next.handle(req); // skip adding token
    }

    // otherwise add the token
    const token = LocalStorage.getAuthToken();

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next.handle(authReq);
  }

  private handleUnauthorized(next: HttpHandler) {
    // TODO: call refreshToken method from auth service
  }
}
