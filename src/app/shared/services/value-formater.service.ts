import { DatePipe } from '@angular/common';

export class FormatValueService {
  static formatDatetimeForDisplay(value: string): string {
    const datePipe = new DatePipe('en');
    return datePipe.transform(value, 'dd/MM/yyyy HH:mm') || '';
  }

  static formatDateForDisplay(value: string): string {
    const datePipe = new DatePipe('en');
    return datePipe.transform(value, 'dd/MM/yyyy') || '';
  }

  static formatNumber(value: string): string {
    if (!value) return '- -';
    const isValidNumber = /^-?\d+(\.\d+)?$/.test(value.trim());
    if (!isValidNumber) return '- -';

    const parsed = parseFloat(value);
    if (isNaN(parsed)) return value;
    return parsed.toLocaleString('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  static formatTimeForDisplay(value: string): string {
    const datePipe = new DatePipe('en');
    return datePipe.transform(value, 'HH:mm') || ''; // Format to '10:30'
  }
}
