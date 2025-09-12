import { Component, computed, TemplateRef, viewChild } from '@angular/core';
import { FormField } from '../../shared/components/form/fields/field';
import { TextField } from '../../shared/components/form/fields/text-field';
import { SelectField } from '../../shared/components/form/fields/select-field';
import { DateField } from '../../shared/components/form/fields/date-field';
import { MultiSelectField } from '../../shared/components/form/fields/multi-select-field';
import { CheckField } from '../../shared/components/form/fields/check-field';
import { TemplateField } from '../../shared/components/form/fields/template-field';
import { NumericField } from '../../shared/components/form/fields/numeric-field';

@Component({
  selector: 'app-form-test',
  standalone: false,
  templateUrl: './form-test.component.html',
  styleUrl: './form-test.component.scss',
})
export class FormTestComponent {
  templateField = viewChild<TemplateRef<unknown>>('templateField');

  submit(values: any) {
    console.log(values);
  }

  fields = computed<FormField[]>(() => [
    new TextField({ name: 'text', label: 'Text', colspan: 12 }),
    new NumericField({ name: 'numeric', label: 'Numeric', colspan: 12 }),
    new SelectField({
      name: 'select',
      label: 'Select',
      options: [],
      colspan: 12,
    }),
    new MultiSelectField({
      name: 'multiselect',
      label: 'Multiselect',
      options: [],
      colspan: 12,
    }),
    new DateField({ name: 'date', label: 'Date', colspan: 8 }),
    new DateField({ name: 'month', label: 'Month', type: 'month', colspan: 8 }),
    new DateField({ name: 'time', label: 'Time', type: 'time', colspan: 8 }),
    new CheckField({ name: 'check', label: 'Check' }),
    new TemplateField({ template: this.templateField(), label: 'Template' }),
  ]);
}
