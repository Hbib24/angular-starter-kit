import { TemplateRef } from '@angular/core';
import { CheckField } from '../components/form/fields/check-field';
import { DateField } from '../components/form/fields/date-field';
import { FormField } from '../components/form/fields/field';
import { MultiSelectField } from '../components/form/fields/multi-select-field';
import { NumericField } from '../components/form/fields/numeric-field';
import { SelectField } from '../components/form/fields/select-field';
import { TemplateField } from '../components/form/fields/template-field';
import { TextField } from '../components/form/fields/text-field';
import { TimeField } from '../components/form/fields/time-field';
import { AreaField } from '../components/form/fields/area-field';
import { RadioField } from '../components/form/fields/radio-field';

export class FieldAdapter {
  constructor(protected readonly field: FormField) {}

  get templateLabel() {
    return this.field.label instanceof TemplateRef ? this.field.label : null;
  }

  get isTextField() {
    return this.field instanceof TextField;
  }

  get isNumericField() {
    return this.field instanceof NumericField;
  }

  get isSelectField() {
    return this.field instanceof SelectField;
  }

  get isMultiSelectField() {
    return this.field instanceof MultiSelectField;
  }

  get isDateField() {
    return this.field instanceof DateField;
  }

  get isTimeField() {
    return this.field instanceof TimeField;
  }

  get isCheckField() {
    return this.field instanceof CheckField;
  }

  get isRadioField() {
    return this.field instanceof RadioField;
  }

  get isTemplateField() {
    return this.field instanceof TemplateField;
  }

  get isAreaField() {
    return this.field instanceof AreaField;
  }

  get fieldAsAreaField() {
    return this.field as AreaField;
  }

  get fieldAsSelectField() {
    return this.field as SelectField;
  }

  get fieldAsDateField() {
    return this.field as DateField;
  }

  get fieldAsNumericField() {
    return this.field as NumericField;
  }

  get fieldAsMultiSelectField() {
    return this.field as MultiSelectField;
  }

  get fieldAsTextField() {
    return this.field as TextField;
  }

  get fieldAsCheckField() {
    return this.field as CheckField;
  }

  get fieldAsTemplateField() {
    return this.field as TemplateField;
  }

  get fieldAsTimeField() {
    return this.field as TimeField;
  }

  get fieldAsRadioField() {
    return this.field as RadioField;
  }
}
