import { CanMatchFn } from '@angular/router';
import { environment } from '../../../environments/environment';

export const devEnvironmentGuard: CanMatchFn = (route, segments) => {
  return !environment.IS_PROD;
};
