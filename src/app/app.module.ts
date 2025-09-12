import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { CommonComponent } from './layouts/common/common.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNzI18n, fr_FR } from 'ng-zorro-antd/i18n';

import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CommonComponent,
    NotFoundComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), provideNzI18n(fr_FR)],
  bootstrap: [AppComponent],
})
export class AppModule {}
