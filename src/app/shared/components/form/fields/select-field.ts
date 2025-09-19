import { TemplateRef } from '@angular/core';
import { Field, FieldOptions } from './field';
import { FormGroup } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string | TemplateRef<SelectOption>;
  /*
   * Overrides label display
   */
  type?: 'currency';
  disabled?: boolean;
  hidden?: boolean;
  visisble?: boolean;
}

interface SelectFieldOptions extends FieldOptions {
  options?:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  valueAsObject?: boolean;
}

export class SelectField extends Field<string> {
  options:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  valueAsObject: boolean;

  constructor(options: SelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.valueAsObject = options.valueAsObject || false;
  }
}
