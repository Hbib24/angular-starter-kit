import { TemplateRef } from '@angular/core';
import { AbstractField, AbstractFieldOptions } from './abstract-field';

export interface SelectOption<T> {
  value: T;
  label: string | TemplateRef<any>;
  disabled?: boolean;
  hidden?: boolean;
}

export enum SelectType {
  DEFAULT = 'default',
  RADIO = 'radio',
  MULTI = 'multi',
}

interface SelectFieldOptions<T> extends AbstractFieldOptions {
  options?: SelectOption<T>[];
  value?: T;
  selectType?: SelectType;
}

export class SelectField<T> extends AbstractField {
  options: SelectOption<T>[];
  value?: T;
  selectType?: SelectType;

  constructor(options: SelectFieldOptions<T>) {
    super(options);
    this.options = options.options || [];
    this.value = options.value;
    this.selectType = options.selectType || SelectType.DEFAULT;
  }
}
