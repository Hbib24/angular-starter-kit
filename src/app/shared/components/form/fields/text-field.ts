import { AbstractField, AbstractFieldOptions } from './abstract-field';

interface TextFieldOptions extends AbstractFieldOptions {
  value?: string;
}

export class TextField extends AbstractField {
  value?: string;

  constructor(options: TextFieldOptions) {
    super(options);
    this.value = options.value || '';
  }
}
