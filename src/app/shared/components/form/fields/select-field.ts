import { TemplateRef } from '@angular/core';
import { Field, FieldOptions } from './field';
import { FormGroup } from '@angular/forms';

export interface SelectOption {
  value: string | number;
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
  options?:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  selectType?: SelectType;
  valueAsObject?: boolean;
}

export class SelectField extends Field<string> {
  options:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  selectType: SelectType;
  valueAsObject: boolean;

  constructor(options: SelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.selectType = options.selectType || SelectType.DEFAULT;
    this.valueAsObject = options.valueAsObject || false;
  }
}
