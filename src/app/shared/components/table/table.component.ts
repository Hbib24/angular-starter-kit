import { Component, input, OnInit, output, TemplateRef } from '@angular/core';
import { defaultGetter, Getter } from '../../helpers/getter';
import { Currency } from '../../helpers/currency';

export interface Column {
  key: string;
  label?: string;
  type?: 'date' | 'time' | 'datetime' | Currency;
  hidden?: boolean;
  fixed?: 'left' | 'right';
  format?: (value: any) => any;
}

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  columns = input.required<Column[]>();
  itemTemplates = input<{ [key: string]: TemplateRef<{ $implicit: any }> }>({});
  pagination = input(true);
  getter = input<Getter>(defaultGetter);

  refreshEvent = output<{ [key: string]: any }>();

  protected items: { [key: string]: any }[] = [];
  protected loading = false;
  protected error = false;
  protected totalSize = 0;
  protected page = 1;

  ngOnInit(): void {
    this.setItems();
  }

  async setItems(params?: any) {
    this.loading = true;
    this.error = false;

    try {
      const { count, data } = await this.getter()(params);
      this.items = data;
      this.totalSize = count;
    } catch (error) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  getValue(headerVal: string, item: any): string {
    if (headerVal.split('').includes('.')) {
      const keys = headerVal.split('.');
      try {
        keys.forEach((e) => (item = item[e]));
        return item;
      } catch (e) {
        return '';
      }
    } else {
      return item[headerVal];
    }
  }

  onPageChange = (page: number) => {
    this.page = page;
    this.setItems({ page: this.page });
  };
}
