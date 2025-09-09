import { Component, input, output, TemplateRef } from '@angular/core';
import { Getter, PaginatedResponse } from '../../helpers/getter-response';

export interface Column {
  label: string;
  key: string;
  type?: 'date' | 'time' | 'datetime';
}

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  columns = input.required<Column[]>();
  itemTemplates = input<{ [key: string]: TemplateRef<{ $implicit: any }> }>({});
  loading = false;

  pagination = input(true);
  items: { [key: string]: any }[] = [];
  totalSize = 0;
  page = 1;

  refreshEvent = output<{ [key: string]: any }>();

  getter = input.required<Getter>();

  async getItems(params?: any) {
    this.loading = true;
    const { count, data } = await this.getter()(params);
    this.items = data;
    this.totalSize = count;
    this.loading = false;
  }
}
