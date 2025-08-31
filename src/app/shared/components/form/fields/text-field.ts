import { Field, FieldOptions } from './field';

interface TextFieldOptions extends FieldOptions {
  minLength?: number;
  maxLength?: number;
}

export class TextField extends Field<string> {
  minLength?: number;
  maxLength?: number;

  constructor(options: TextFieldOptions) {
    super(options);

    this.value = options.value || '';
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
  }
}
