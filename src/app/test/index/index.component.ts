import { Component, inject } from '@angular/core';
import { initializeTranslationExtensionsFactory } from '../../core/helpers/translations.extentiosn';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  translate = inject(TranslateService);
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

    this.translate.use(lang).subscribe(() => {
      // Update .tr() with the new language
      initializeTranslationExtensionsFactory(this.translate)();
    });
  }
}
