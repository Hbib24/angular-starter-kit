import { FieldOptions, Field } from './field';

interface NumericFieldOptions extends FieldOptions {
  min?: number;
  max?: number;
  maxDecimals?: number;
  minDecimals?: number;
  allowNegative?: boolean;
  formatter?: (value: number) => any;
  stringify?: boolean;
}

export class NumericField extends Field<number> {
  min?: number;
  max?: number;
  maxDecimals?: number;
  minDecimals?: number;
  allowNegative: boolean;
  formatter?: (value: number) => any;
  stringify: boolean;

  constructor(options: NumericFieldOptions) {
    super(options);

    this.min = options.min;
    this.max = options.max;
    this.maxDecimals = options.maxDecimals;
    this.minDecimals = options.minDecimals;
    this.allowNegative = options.allowNegative || false;
    this.formatter = options.formatter;
    this.stringify = options.stringify === undefined ? true : options.stringify;
  }
}
