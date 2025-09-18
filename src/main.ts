/// <reference types="@angular/localize" />

import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import en from '@angular/common/locales/en';
import ar from '@angular/common/locales/ar';

registerLocaleData(fr);
registerLocaleData(en);
registerLocaleData(ar);
platformBrowser()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .then((ref) => {
    if (!environment.IS_PROD) {
      console.table(environment);
    }
  })
  .catch((err) => console.error(err));
