import { FieldOptions, Field } from './field';

interface CheckFieldOptions extends FieldOptions {
  type?: 'default' | 'switch';
}

export class CheckField extends Field<boolean> {
  type: 'default' | 'switch';

  constructor(options: CheckFieldOptions) {
    super(options);

    this.value = options.value || false;
    this.type = options.type || 'default';
  }
}
