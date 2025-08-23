import { Component, computed, input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NumericField } from '../form/fields/numeric-field';
import { SelectField } from '../form/fields/select-field';
import { TextField } from '../form/fields/text-field';
import { FormFieldType } from '../form/form';

@Component({
  selector: 'app-form-field',
  standalone: false,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  readonly field = input.required<FormFieldType>();
  readonly form = input.required<FormGroup>();
  readonly control = computed(() => this.form().get(this.field().name));
  readonly isValid = computed(
    () => this.form().controls[this.field().name].valid
  );
  readonly isRequired = computed(() =>
    this.control()?.hasValidator(Validators.required)
  );

  get isTextField() {
    return this.field() instanceof TextField;
  }

  get isNumericField() {
    return this.field() instanceof NumericField;
  }

  get isSelectField() {
    return this.field() instanceof SelectField;
  }

  get selectOptions() {
    if (this.isSelectField) {
      return (this.field() as SelectField<any>).options;
    }
    return [];
  }
}
