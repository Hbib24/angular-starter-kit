import { Component, inject } from '@angular/core';
import { initializeTranslationExtensionsFactory } from '../../core/helpers/translations.extentiosn';
import { TranslateService } from '@ngx-translate/core';
import { ar_EG, en_US, fr_FR, NzI18nService } from 'ng-zorro-antd/i18n';
const localeMap: Record<string, any> = {
  fr: fr_FR,
  en: en_US,
  ar: ar_EG,
};
@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  translate = inject(TranslateService);
  nzI18n = inject(NzI18nService);
  disabled = false;
  loading = false;

  fakeActionAsync() {
    this.loading = true;
    return new Promise<void>((resolve) => {
      console.log('Starting fake action...');
      setTimeout(() => {
        resolve();
        this.loading = false;
      }, 2000);
    });
  }
  normalFakeAction() {
    this.disabled = true;

    console.log('Normal action executed');
  }

  changeLanguage(lang: string) {
    localStorage.setItem('lang', lang);

    // ngx-translate updates your custom .tr() texts
    this.translate.use(lang).subscribe(() => {
      // ✅ update Ant Design components immediately
      this.nzI18n.setLocale(localeMap[lang]);

      // ✅ refresh your String.prototype.tr extension
      initializeTranslationExtensionsFactory(this.translate)();
    });
  }
}
