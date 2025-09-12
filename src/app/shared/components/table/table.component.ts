import {
  Component,
  Input,
  input,
  OnInit,
  output,
  TemplateRef,
} from '@angular/core';
import { defaultGetter, Getter } from '../../helpers/getter';
import { FormatValueService } from '../../services/formateur-value.service';
import { WidthCalculator } from '../../services/width-calculator.service';
import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
} from 'ng-zorro-antd/table';

export interface Column<T = any> {
  key: string;
  width?: string;
  label?: string;
  hidden?: boolean;
  fixed?: 'left' | 'right';
  type?: 'date' | 'time' | 'datetime' | 'currency';
  format?: (value: any, row: T) => any;
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
export class TableComponent<T = any> implements OnInit {
  protected items: T[] = [];
  protected loading = false;
  protected error = false;
  protected totalSize = 0;
  protected page = 1;

  protected scrollX: string | null = null;
  protected scrollY: string | null = null;

  private _settingValue: Setting = {
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

  @Input()
  set settingValue(value: Partial<Setting> | undefined) {
    // merge input with default values
    this._settingValue = { ...this._settingValue, ...value };
  }
  get settingValue(): Setting {
    return this._settingValue;
  }

  columns = input.required<Column<T>[]>();
  getter = input<Getter<T>>(defaultGetter);
  pagination = input(true);
  itemTemplates = input<{ [key: string]: TemplateRef<{ $implicit: any }> }>({});
  refreshEvent = output<{ [key: string]: any }>();

  ngOnInit(): void {
    this.scrollX = 'max-content';
    this.scrollY = this.settingValue.fixHeader
      ? this.settingValue.fixHeader
      : null;
    this.setItems();
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
    console.log(this.itemTemplates());
    return this.itemTemplates()[key];
  }

  getValue(headerVal: string, item: any): any {
    if (headerVal.includes('.')) {
      return headerVal.split('.').reduce((acc, k) => acc?.[k] ?? '', item);
    }
    return item[headerVal];
  }

  getColumnWidth(col: Column<T>): string | null {
    if (this.itemTemplates()[col.key]) {
      console.log('has template', col.key);
      return '150px';
    }
    return WidthCalculator.getColumnWidth(
      col,
      this.items,
      this.settingValue.fixHeader !== null
    );
  }

  formatValue(col: Column<T>, value: any): string {
    if (col.format) return col.format(value, {} as T);
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
    this.page = page;
    this.setItems({ page });
  }
}
