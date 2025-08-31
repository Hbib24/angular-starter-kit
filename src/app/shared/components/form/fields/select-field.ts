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
  selectType?: SelectType;
}

export class SelectField extends Field<string> {
  options: SelectOption[];
  selectType: SelectType;

  constructor(options: SelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.selectType = options.selectType || SelectType.DEFAULT;
  }
}
