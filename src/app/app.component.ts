import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { initializeTranslationExtensionsFactory } from './core/helpers/translations.extentiosn';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent {
  private translate = inject(TranslateService);
  constructor() {
    const lang = localStorage.getItem('lang') || 'fr';

    this.translate.addLangs(['fr', 'en', 'ar']);
    this.translate.use(lang);

    // Inject .tr() extension
    initializeTranslationExtensionsFactory(this.translate);
  }
}
