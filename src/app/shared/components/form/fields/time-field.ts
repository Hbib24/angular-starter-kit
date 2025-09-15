import { Field, FieldOptions } from './field';

interface TimeFieldOptions extends FieldOptions {
  showSeconds?: boolean;
}

export class TimeField extends Field<string> {
  showSeconds: boolean;

  constructor(options: TimeFieldOptions) {
    super(options);

    this.showSeconds = options.showSeconds || false;
  }
}
