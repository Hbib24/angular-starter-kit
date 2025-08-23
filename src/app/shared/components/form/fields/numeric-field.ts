import { FieldOptions, Field } from './field';

interface NumericFieldOptions extends FieldOptions {
  value?: number;
}

export class NumericField extends Field {
  value?: number;

  constructor(options: NumericFieldOptions) {
    super(options);

    this.value = options.value;
  }
}
