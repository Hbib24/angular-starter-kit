import { FormGroup } from '@angular/forms';
import { Field, FieldOptions } from './field';
import { SelectOption } from './select-field';

interface MultiSelectFieldOptions extends FieldOptions {
  options?:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  valueAsObject?: boolean;
}

export class MultiSelectField extends Field<string[]> {
  options:
    | SelectOption[]
    | ((formGroup: FormGroup) => Promise<SelectOption[]> | SelectOption[]);
  valueAsObject: boolean;

  constructor(options: MultiSelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.value = options.value || [];
    this.valueAsObject = options.valueAsObject || false;
  }
}
