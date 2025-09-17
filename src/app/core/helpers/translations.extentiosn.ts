import { TranslateService } from '@ngx-translate/core';

declare global {
  interface String {
    tr(params?: Record<string, any>): string;
  }
}

export function initializeTranslationExtensionsFactory(
  translateService: TranslateService
) {
  return () => {
    String.prototype.tr = function (params?: Record<string, any>): string {
      // If 'this' is null/undefined or empty
      if (this == null) return '';

      const key = this.toString().trim();
      if (!key) return '';

      const safeParams = params || {};

      // Get translation
      let result: any = translateService.instant(key, safeParams);

      // If ngx-translate returns object (nested JSON), fallback to key
      if (typeof result !== 'string') {
        return key;
      }

      // Remove any unreplaced placeholders {{ ... }}
      result = result.replace(/\{\{.*?\}\}/g, '').trim();

      return result || '';
    };
  };
}
