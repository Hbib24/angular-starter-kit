import { FormGroup } from '@angular/forms';
import { NumericField } from './fields/numeric-field';
import { SelectField } from './fields/select-field';
import { TextField } from './fields/text-field';

export type FormFieldType = NumericField | TextField | SelectField<any>;

export class Form {
  readonly name: string;
  readonly fields: FormFieldType[];
  readonly formGroup: FormGroup;

  constructor(name: string, fields: FormFieldType[], form: FormGroup) {
    this.name = name;
    this.fields = fields;
    this.formGroup = form;
  }

  getControl(name: string) {
    return this.formGroup.get(name);
  }

  getField(name: string) {
    return this.fields.find((field) => field.name === name);
  }
}
