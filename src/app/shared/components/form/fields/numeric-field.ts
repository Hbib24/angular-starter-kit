import { AbstractFieldOptions, AbstractField } from './abstract-field';

interface NumericFieldOptions extends AbstractFieldOptions {
  value?: number;
}

export class NumericField extends AbstractField {
  value?: number;

  constructor(options: NumericFieldOptions) {
    super(options);

    this.value = options.value;
  }
}
