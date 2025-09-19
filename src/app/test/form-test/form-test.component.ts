import { Component, computed, TemplateRef, viewChild } from '@angular/core';
import { FormField } from '../../shared/components/form/fields/field';
import { TextField } from '../../shared/components/form/fields/text-field';
import {
  SelectField,
  SelectOption,
} from '../../shared/components/form/fields/select-field';
import { DateField } from '../../shared/components/form/fields/date-field';
import { MultiSelectField } from '../../shared/components/form/fields/multi-select-field';
import { CheckField } from '../../shared/components/form/fields/check-field';
import { TemplateField } from '../../shared/components/form/fields/template-field';
import { NumericField } from '../../shared/components/form/fields/numeric-field';
import { TimeField } from '../../shared/components/form/fields/time-field';
import { delay, lastValueFrom, of } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { AreaField } from '../../shared/components/form/fields/area-field';
import { RadioField } from '../../shared/components/form/fields/radio-field';

@Component({
  selector: 'app-form-test',
  standalone: false,
  templateUrl: './form-test.component.html',
  styleUrl: './form-test.component.scss',
})
export class FormTestComponent {
  templateFieldContent = viewChild<TemplateRef<unknown>>(
    'templateFieldContent'
  );
  templateFieldLabel = viewChild<TemplateRef<unknown>>('templateFieldLabel');
  optionTemplate = viewChild<TemplateRef<SelectOption>>('optionTemplate');

  submit(values: any) {
    console.table(values);
  }

  fields = computed<FormField[]>(() => [
    new TextField({
      name: 'text',
      label: 'Text',
      colspan: 12,
      required: true,
      validationHint: 'This is a required field',
      hint: 'This is a hint',
      onValueChange: (value) => {
        console.log(value);
      },
      autoCompleteOptions: (value) =>
        value
          ? lastValueFrom(
              of([value, value + value, value + value + value]).pipe(
                delay(2000)
              )
            )
          : [],
    }),
    new NumericField({
      name: 'numeric',
      label: 'Numeric',
      colspan: 12,
      max: 10,
      min: 1,
      validationHint: 'Input between 1 and 10',
    }),
    new SelectField({
      name: 'curr',
      label: 'Select',
      options: [
        { label: 'EUR', value: '1', type: 'currency' },
        { label: 'USD', value: '2', type: 'currency' },
      ],
      colspan: 12,
    }),
    new SelectField({
      name: 'select',
      label: 'Select',
      options: () => {
        return lastValueFrom(
          of([
            { label: this.optionTemplate() || '', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]).pipe(delay(2000))
        );
      },
      colspan: 12,
    }),
    new MultiSelectField({
      name: 'multiselect',
      label: 'Multiselect',
      // visible: (formGroup: FormGroup) => {
      //   return formGroup.get('select')?.value === '2';
      // },
      dependencies: ['select'],
      options: (formGroup: FormGroup) => {
        if (formGroup.get('select')?.value !== '2')
          return [{ label: 'Option 1', value: '1' }];
        return lastValueFrom(
          of([
            { label: this.optionTemplate() || '', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]).pipe(delay(2000))
        );
      },
      colspan: 12,
    }),
    new RadioField({
      name: 'radio',
      label: 'Radio',
      options: () => {
        return lastValueFrom(
          of([
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]).pipe(delay(2000))
        );
      },
      colspan: 12,
    }),
    new RadioField({
      name: 'tabs',
      label: 'Tabs',
      type: 'tabs',
      dependencies: ['radio'],
      options: (formGroup: FormGroup) => {
        if (formGroup.get('radio')?.value !== '2')
          return [{ label: 'Option 1', value: '1' }];
        return lastValueFrom(
          of([
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]).pipe(delay(2000))
        );
      },
      colspan: 12,
    }),
    new DateField({ name: 'date', label: 'Date', colspan: 6 }),
    new DateField({
      name: 'datetime',
      label: 'Date With Time',
      colspan: 6,
      type: 'datetime',
    }),
    new DateField({ name: 'month', label: 'Month', type: 'month', colspan: 6 }),
    new TimeField({ name: 'time', label: 'Time', colspan: 6 }),
    new CheckField({ name: 'check', label: 'Check', colspan: 2 }),
    new CheckField({
      name: 'switch',
      label: 'Switch',
      type: 'switch',
      colspan: 22,
    }),
    new AreaField({
      name: 'area',
      label: 'Area',
      colspan: 24,
      rows: 4,
      required: true,
    }),
    new TemplateField({
      label: this.templateFieldLabel(),
      template: this.templateFieldContent(),
    }),
  ]);
}
