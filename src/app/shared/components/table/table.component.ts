import {
  Component,
  computed,
  Input,
  input,
  OnInit,
  output,
  TemplateRef,
} from '@angular/core';
import { defaultGetter, Getter } from '../../helpers/getter';
import { FormatValueService } from '../../services/value-formater.service';
import { WidthCalculator } from '../../services/width-calculator.service';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';

export interface Column {
  key: string;
  width?: string;
  label?: string;
  hidden?: boolean;
  fixed?: 'left' | 'right';
  type?: 'date' | 'time' | 'datetime' | 'currency';
  sortDirections?: NzTableSortOrder[];

  sortOrder?: NzTableSortOrder | null;

  sortFn?: NzTableSortFn<any> | null;

  format?: (value: any, row: any) => any;
}

export interface Setting {
  checkbox: boolean;
  rowSelectable?: (row: any) => boolean;
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  header: TemplateRef<{ $implicit: any }> | string | null;
  footer: TemplateRef<{ $implicit: any }> | string | null;
  expandable: boolean;
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
  setOfCheckedId = new Set<string | number>();
  checked = false;
  indeterminate = false;
  protected items: any[] = [];
  protected loading = false;
  protected error = false;
  protected totalSize = 0;
  protected page = 1;

  protected scrollX: string | null = null;
  protected scrollY: string | null = null;
  private readonly defaultOptions: Setting = {
    bordered: true,
    loading: false,
    pagination: true,
    sizeChanger: false,
    header: null,
    footer: null,
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

  columns = input.required<Column[]>();
  getter = input<Getter>(defaultGetter);
  selectedRowsChange = output<any[]>();
  pagination = input(true);
  itemTemplates = input<{ [key: string]: TemplateRef<{ $implicit: any }> }>({});
  refreshEvent = output<{ [key: string]: any }>();

  ngOnInit(): void {
    this.scrollX = 'max-content';
    this.scrollY = this._options().fixHeader ? this._options().fixHeader : null;
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

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Returns the template associated with the given key.
   * If no template is associated with the key, returns undefined.
   * @param key The key to look up the template for.
   * @returns The template associated with the given key, or undefined if no template exists for the key.
   */
  /*******  edb98c46-256d-46e4-857a-c2140f1d2b00  *******/ /** Add a new row to the table. */
  addRow(newRow: any): void {
    // if you need an id, generate it if not present
    if (newRow.id == null) {
      newRow.id = crypto.randomUUID();
    }
    this.items = [...this.items, newRow];

    // keep pagination/selection consistent
    this.totalSize = this.items.length;
    this.refreshCheckedStatus();
    this.emitSelectedRows();
  }

  deleteRow(value: string | number, key?: string): void {
    key = key || 'id';

    // Find matching rows before deleting (to know what was removed)
    const removedRows = this.items.filter((row) => row[key] === value);

    // Remove them from the data set
    this.items = this.items.filter((row) => row[key] !== value);

    // Remove from selected set if the key is 'id' or if you want to track by that key
    if (key === 'id') {
      this.setOfCheckedId.delete(value);
    }

    // Update counts and selection
    this.totalSize = this.items.length;
    this.refreshCheckedStatus();
    this.emitSelectedRows();

    // Optionally emit the removed rows so parent knows what was deleted
    // (uncomment if you have an output)
    // this.rowDeleted.emit({ key, value, removedRows });
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
    this.page = page;
    this.setItems({ page });
  }

  onCurrentPageDataChange(list: any[]): void {
    this.items = list;
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string | number, checked: boolean): void {
    if (checked) this.setOfCheckedId.add(id);
    else this.setOfCheckedId.delete(id);
  }

  refreshCheckedStatus(): void {
    const enabled = this.items.filter(
      (row) => this._options().rowSelectable?.(row) ?? true
    );
    this.checked = enabled.every((row) => this.setOfCheckedId.has(row.id));
    this.indeterminate =
      enabled.some((row) => this.setOfCheckedId.has(row.id)) && !this.checked;
  }

  private emitSelectedRows(): void {
    const selected = this.items.filter((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.selectedRowsChange.emit(selected);
  }

  onItemChecked(id: string | number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.emitSelectedRows(); // <── emit
  }

  onAllChecked(checked: boolean): void {
    this.items
      .filter((row) => this._options().rowSelectable?.(row) ?? true)
      .forEach((row) => this.updateCheckedSet(row.id, checked));
    this.refreshCheckedStatus();
    this.emitSelectedRows();
  }
}
