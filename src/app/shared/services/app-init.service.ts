import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { initializeTranslationExtensionsFactory } from '../../core/helpers/translations.extentiosn';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  translate = inject(TranslateService);
  private acceptedLanguages = ['fr', 'en', 'ar'];
  constructor() {
    let lang = localStorage.getItem('lang') || 'fr';
    if (lang && !this.acceptedLanguages.includes(lang)) {
      lang = 'fr';
    }

    this.translate.addLangs(this.acceptedLanguages);
    this.translate.use(lang);

    initializeTranslationExtensionsFactory(this.translate)();
  }
}
