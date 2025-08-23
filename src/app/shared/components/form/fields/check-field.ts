import { AbstractFieldOptions, AbstractField } from './abstract-field';

interface CheckFieldOptions extends AbstractFieldOptions {
  value?: boolean;
}

export class CheckField extends AbstractField {
  value?: boolean;

  constructor(options: CheckFieldOptions) {
    super(options);

    this.value = options.value || false;
  }
}
