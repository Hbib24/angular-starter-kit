import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  readonly locale = signal<'fr' | 'en'>('fr');

  setLocale(newLocale: 'fr' | 'en') {
    this.locale.set(newLocale);
  }
}
