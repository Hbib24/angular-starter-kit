import { Field, FieldOptions } from './field';

interface TextFieldOptions extends FieldOptions {
  value?: string;
}

export class TextField extends Field {
  value?: string;

  constructor(options: TextFieldOptions) {
    super(options);
    this.value = options.value || '';
  }
}
