import { Field, FieldOptions } from './field';
import { SelectOption } from './select-field';

interface MultiSelectFieldOptions extends FieldOptions {
  options?: SelectOption[];
  value?: string[];
}

export class MultiSelectField extends Field {
  options: SelectOption[];
  value: string[];

  constructor(options: MultiSelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.value = options.value || [];
  }
}
