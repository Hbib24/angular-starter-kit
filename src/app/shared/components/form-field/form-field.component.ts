import { Component, computed, input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NumericField } from '../form/fields/numeric-field';
import { SelectField, SelectOption } from '../form/fields/select-field';
import { TextField } from '../form/fields/text-field';
import { FormField } from '../form/fields/field';

@Component({
  selector: 'app-form-field',
  standalone: false,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  readonly field = input.required<FormField>();
  readonly form = input.required<FormGroup>();
  readonly control = computed(() => this.form().get(this.field().name));

  constructor() {
    if (this.isSelectField) this.setSelectOptions();
  }

  selectOptions: SelectOption[] = [];

  get isRequired() {
    return this.control()?.hasValidator(Validators.required);
  }

  get isValid() {
    return this.control()?.valid;
  }

  get isDirty() {
    return this.control()?.dirty;
  }

  get isReadonly() {
    return this.control()?.disabled;
  }

  get isVisible() {
    return this.field().isVisible(this.form());
  }

  get isTextField() {
    return this.field() instanceof TextField;
  }

  get isNumericField() {
    return this.field() instanceof NumericField;
  }

  get isSelectField() {
    return this.field() instanceof SelectField;
  }

  get fieldAsSelectField() {
    return this.field() as SelectField;
  }

  setSelectOptions() {
    const options = this.fieldAsSelectField.options;
    if (typeof options == 'function') {
      this.field().dependencies.forEach((dependency: string) => {
        this.form()
          .get(dependency)
          ?.valueChanges.subscribe(async () => {
            this.selectOptions = await options(this.form());
          });
      });
    } else {
      this.selectOptions = options;
    }
  }
}
