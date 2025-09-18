import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { initializeTranslationExtensionsFactory } from '../../core/helpers/translations.extentiosn';
import { TranslateService } from '@ngx-translate/core';
import { ar_EG, en_US, fr_FR, NzI18nService } from 'ng-zorro-antd/i18n';
import { NotificationService } from '../../shared/services/notification.service';
import { NzNotificationComponent } from 'ng-zorro-antd/notification';
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
  notif = inject(NotificationService);
  disabled = false;
  loading = false;

  btnTemplate = viewChild<TemplateRef<any>>('notificationBtnTpl');
  closeIconnNotif = viewChild<TemplateRef<any>>('closeIconnNotif');

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

  save() {
    // do work…
    this.notif.success({
      buttons: this.btnTemplate(),

      title: 'Enregistré',
      content: 'Les données ont été sauvegardées avec succès.',
      duration: 3000,
    });
  }
  onAccept(notification: NzNotificationComponent) {
    console.log('Accepted!');
    notification.close();
  }

  onDecline(notification: NzNotificationComponent) {
    console.log('Declined!');
    notification.close();
  }
}
