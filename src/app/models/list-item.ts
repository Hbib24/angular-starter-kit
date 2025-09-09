import { TemplateRef } from '@angular/core';

export enum ItemType {
  DATE = 'date',
  TIME = 'time',
  DATE_TIME = 'date-time',
}

export interface ListItem {
  label?: string | TemplateRef<any>;
  key: string;
  formatValue?: (value: any) => any;
  hidden?: boolean | ((row: { [key: string]: any }) => boolean);
  type?: ItemType;
}
