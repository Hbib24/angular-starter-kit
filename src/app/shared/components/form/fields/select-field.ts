import { TemplateRef } from '@angular/core';
import { Field, FieldOptions } from './field';

export interface SelectOption {
  value: string;
  label: string | TemplateRef<any>;
  disabled?: boolean;
  hidden?: boolean;
  visisble?: boolean;
}

export enum SelectType {
  DEFAULT = 'default',
  RADIO = 'radio',
  TABS = 'tabs',
}

interface SelectFieldOptions extends FieldOptions {
  options?: SelectOption[];
  value?: string;
  selectType?: SelectType;
}

export class SelectField extends Field {
  options: SelectOption[];
  value?: string;
  selectType: SelectType;

  constructor(options: SelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.value = options.value;
    this.selectType = options.selectType || SelectType.DEFAULT;
  }
}
