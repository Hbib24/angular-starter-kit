import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Response } from '../../core/helpers/http-response';
import { environment } from '../../../environments/environment';
import { BYPASS_AUTH } from '../../core/helpers/auth-context.token';

interface Options {
  authenticate?: boolean;
  baseUrl?: string;
}

@Injectable()
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  get<T>(endpoint: string, queryParams?: HttpParams, options?: Options) {
    const url = this.getUrl(endpoint, options);

    return this.http.get<Response<T>>(url, {
      params: queryParams,
      context: new HttpContext().set(
        BYPASS_AUTH,
        options?.authenticate === false
      ),
    });
  }

  post<T>(endpoint: string, body: any, options?: Options) {
    const url = this.getUrl(endpoint, options);

    return this.http.post<Response<T>>(url, body, {
      context: new HttpContext().set(
        BYPASS_AUTH,
        options?.authenticate === false
      ),
    });
  }

  put<T>(endpoint: string, body: any, options?: Options) {
    const url = this.getUrl(endpoint, options);

    return this.http.put<Response<T>>(url, body, {
      context: new HttpContext().set(
        BYPASS_AUTH,
        options?.authenticate === false
      ),
    });
  }

  delete<T>(endpoint: string, options?: Options) {
    const url = this.getUrl(endpoint, options);

    return this.http.delete<Response<T>>(url, {
      context: new HttpContext().set(
        BYPASS_AUTH,
        options?.authenticate === false
      ),
    });
  }

  private getUrl(endpoint: string, options?: Options) {
    return `${options?.baseUrl || this.baseUrl}/${endpoint}`.replace(
      /\/+/g,
      '/'
    );
  }
}
