import { FieldOptions, Field } from './field';

interface NumericFieldOptions extends FieldOptions {
  min?: number;
  max?: number;
}

export class NumericField extends Field<number> {
  min?: number;
  max?: number;

  constructor(options: NumericFieldOptions) {
    super(options);

    this.min = options.min;
    this.max = options.max;
  }
}
