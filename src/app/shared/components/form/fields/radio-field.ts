import { FormGroup } from '@angular/forms';
import { FieldOptions, Field } from './field';
import { SelectOption } from './select-field';

export type RadioType = 'default' | 'tabs';

interface RadioFieldOptions extends FieldOptions {
  options?:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  valueAsObject?: boolean;
  type?: RadioType;
}

export class RadioField extends Field<string> {
  options:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  valueAsObject: boolean;
  type: RadioType;

  constructor(options: RadioFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.valueAsObject = options.valueAsObject || false;
    this.type = options.type || 'default';
  }
}
