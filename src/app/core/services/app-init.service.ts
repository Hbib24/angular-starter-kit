import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fr_FR, en_US, ar_EG, NzI18nInterface } from 'ng-zorro-antd/i18n';
import { initializeTranslationExtensionsFactory } from '../helpers/translations.extentiosn';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  translate = inject(TranslateService);
  private acceptedLanguages = ['fr', 'en', 'ar'];
  currentLang: string;

  constructor() {
    let lang = localStorage.getItem('lang') || 'fr';
    if (!this.acceptedLanguages.includes(lang)) lang = 'fr';

    this.translate.addLangs(this.acceptedLanguages);
    this.translate.use(lang);
    this.currentLang = lang;

    initializeTranslationExtensionsFactory(this.translate)();
  }

  /** Map our codes to ng-zorro locale objects */
  get nzLocale(): NzI18nInterface {
    switch (this.currentLang) {
      case 'en':
        return en_US;
      case 'ar':
        return ar_EG;
      default:
        return fr_FR;
    }
  }
}
