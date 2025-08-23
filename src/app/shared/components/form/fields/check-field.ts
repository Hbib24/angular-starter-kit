import { FieldOptions, Field } from './field';

interface CheckFieldOptions extends FieldOptions {
  value?: boolean;
  checkType?: CheckType;
}

enum CheckType {
  DEFAULT = 'default',
  SWITCH = 'switch',
}

export class CheckField extends Field {
  value?: boolean;
  checkType: CheckType;

  constructor(options: CheckFieldOptions) {
    super(options);

    this.value = options.value || false;
    this.checkType = options.checkType || CheckType.DEFAULT;
  }
}
