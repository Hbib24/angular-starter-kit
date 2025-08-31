import { Field, FieldOptions } from './field';
import { SelectOption } from './select-field';

interface MultiSelectFieldOptions extends FieldOptions {
  options?: SelectOption[];
}

export class MultiSelectField extends Field<string[]> {
  options: SelectOption[];

  constructor(options: MultiSelectFieldOptions) {
    super(options);
    this.options = options.options || [];
    this.value = options.value || [];
  }
}
