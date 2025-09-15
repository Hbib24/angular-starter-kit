import { Field, FieldOptions } from './field';

type DateType = 'date' | 'datetime' | 'month' | 'year';

interface DateFieldOptions extends FieldOptions {
  max?: Date;
  min?: Date;
  type?: DateType;
  endOfDay?: boolean;
}

export class DateField extends Field<string> {
  max?: Date;
  min?: Date;
  type: DateType;
  endOfDay: boolean;

  constructor(options: DateFieldOptions) {
    super(options);

    this.max = options.max;
    this.min = options.min;
    this.type = options.type || 'date';
    this.endOfDay = options.endOfDay || false;
  }
}
