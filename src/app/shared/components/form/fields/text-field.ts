import { FormGroup } from '@angular/forms';
import { Field, FieldOptions } from './field';

interface TextFieldOptions extends FieldOptions {
  minLength?: number;
  maxLength?: number;
  autoCompleteOptions?:
    | string[]
    | ((value: string, formGroup: FormGroup) => Promise<string[]> | string[]);
}

export class TextField extends Field<string> {
  minLength?: number;
  maxLength?: number;
  autoCompleteOptions:
    | string[]
    | ((value: string, formGroup: FormGroup) => Promise<string[]> | string[]);

  constructor(options: TextFieldOptions) {
    super(options);

    this.value = options.value || '';
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
    this.autoCompleteOptions = options.autoCompleteOptions || [];
  }
}
