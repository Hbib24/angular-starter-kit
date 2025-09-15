import { Field, FieldOptions } from './field';

interface AreaFieldOptions extends FieldOptions {
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

export class AreaField extends Field<string> {
  minLength?: number;
  maxLength?: number;
  rows: number;

  constructor(options: AreaFieldOptions) {
    super(options);

    this.value = options.value || '';
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
    this.rows = options.rows || 3;
  }
}
