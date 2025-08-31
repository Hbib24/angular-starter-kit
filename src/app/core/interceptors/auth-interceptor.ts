import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BYPASS_AUTH } from '../helpers/auth-context.token';
import { LocalStorage } from '../../shared/helpers/local-storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

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
}
