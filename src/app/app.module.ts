import {
  APP_INITIALIZER,
  LOCALE_ID,
  NgModule,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { CommonComponent } from './layouts/common/common.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppInitializerService } from './core/services/app-init.service';
import { NZ_I18N } from 'ng-zorro-antd/i18n';

export function nzI18nFactory(init: AppInitializerService) {
  return init.nzLocale; // initial locale at bootstrap
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CommonComponent,
    NotFoundComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [
    {
      provide: NZ_I18N,
      useFactory: nzI18nFactory,
      deps: [AppInitializerService],
    },
    {
      provide: LOCALE_ID,
      useFactory: (init: AppInitializerService) => init.currentLang,
      deps: [AppInitializerService],
    },

    {
      provide: APP_INITIALIZER,
      useFactory: (appInit: AppInitializerService) => () => appInit,
      deps: [AppInitializerService],
      multi: true,
    },

    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
