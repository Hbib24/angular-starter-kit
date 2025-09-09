import { Component, computed, inject, input } from '@angular/core';
import { ItemType, ListItem } from '../../../models/list-item';
import { DatePipe } from '@angular/common';
import { LocaleService } from '../../../core/services/locale.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  localeService = inject(LocaleService);
  datePipe = computed(() => new DatePipe(this.localeService.locale()));

  columns = input<ListItem[]>([]);
  items = input<any[]>([]);

  getValue(row: any, column: ListItem) {
    return column.formatValue
      ? column.formatValue(row[column.key])
      : this.formatByType(row[column.key], column.type);
  }

  formatByType(value: any, type?: ItemType) {
    switch (type) {
      case ItemType.DATE:
        return this.datePipe().transform(value, 'dd/MM/yyyy');
      case ItemType.TIME:
        return this.datePipe().transform(value, 'HH:mm');
      case ItemType.DATE_TIME:
        return this.datePipe().transform(value, 'dd/MM/yyyy HH:mm');
      default:
        return value;
    }
  }
}
