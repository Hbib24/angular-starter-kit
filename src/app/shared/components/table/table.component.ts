import {
  Component,
  computed,
  Input,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { defaultGetter, Getter } from '../../helpers/getter';
import { FormatValueService } from '../../services/value-formater.service';
import { WidthCalculator } from '../../services/width-calculator.service';
import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
} from 'ng-zorro-antd/table';

export interface Column {
  key: string;
  width?: string;
  label?: string;
  hidden?: boolean;
  fixed?: 'left' | 'right';
  type?: 'date' | 'time' | 'datetime' | 'currency';
  format?: (value: any, row: any) => any;
}

export interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: string | null;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: 'unset' | 'scroll' | 'fixed';
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
}

@Component({
  standalone: false,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  protected items: any[] = [];
  protected loading = false;
  protected error = false;
  protected totalSize = 0;
  protected page = signal(1);

  protected scrollX: string | null = null;
  protected scrollY: string | null = null;
  private readonly defaultOptions: Setting = {
    bordered: true,
    loading: false,
    pagination: true,
    sizeChanger: false,
    title: false,
    header: true,
    footer: false,
    expandable: false,
    checkbox: false,
    fixHeader: null,
    noResult: false,
    ellipsis: false,
    simple: false,
    size: 'middle',
    tableScroll: 'scroll',
    tableLayout: 'fixed',
    position: 'bottom',
    paginationType: 'default',
  };
  options = input<Partial<Setting>>();

  _options = computed<Setting>(() => ({
    ...this.defaultOptions,
    ...(this.options() ?? {}),
  }));
  params = computed(() => {
    return { ...this.filters(), page: this.page() };
  });

  columns = input.required<Column[]>();
  filters = input<{ [key: string]: any }>({});
  getter = input<Getter>(defaultGetter);
  pagination = input(true);
  itemTemplates = input<{ [key: string]: TemplateRef<{ $implicit: any }> }>({});
  refreshEvent = output<{ [key: string]: any }>();

  ngOnInit(): void {
    this.scrollX = 'max-content';
    this.scrollY = this._options().fixHeader ? this._options().fixHeader : null;
    this.setItems(this.params());
  }

  async setItems(params?: any) {
    this.loading = true;
    this.error = false;
    try {
      const { count, data } = await this.getter()(params);
      this.items = data;
      this.totalSize = count;
    } catch (err) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  getTemplate(key: string): TemplateRef<{ $implicit: any }> | undefined {
    return this.itemTemplates()[key];
  }

  getValue(headerVal: string, item: any): any {
    if (headerVal.includes('.')) {
      return headerVal.split('.').reduce((acc, k) => acc?.[k] ?? '', item);
    }
    return item[headerVal];
  }

  getColumnWidth(col: Column): string | null {
    if (this.itemTemplates()[col.key]) {
      return '150px';
    }
    return WidthCalculator.getColumnWidth(
      col,
      this.items,
      this._options().fixHeader !== null
    );
  }

  formatValue(col: Column, value: any): string {
    if (col.format) return col.format(value, {});
    if (!value) return '';
    switch (col.type) {
      case 'datetime':
        return FormatValueService.formatDatetimeForDisplay(value);
      case 'date':
        return FormatValueService.formatDateForDisplay(value);
      case 'time':
        return FormatValueService.formatTimeForDisplay
          ? FormatValueService.formatTimeForDisplay(value)
          : value;
      case 'currency':

      default:
        return value;
    }
  }

  onPageChange(page: number) {
    this.page.set(page);
    this.setItems(this.params());
  }
}
