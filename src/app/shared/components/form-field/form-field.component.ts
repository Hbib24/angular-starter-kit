import { Component, computed, effect, input } from '@angular/core';
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
    const isVisible = this.field().visible;
    return typeof isVisible === 'function' ? isVisible(this.form()) : isVisible;
  }

  get isHidden() {
    const isHidden = this.field().hidden;
    return typeof isHidden === 'function' ? isHidden(this.form()) : isHidden;
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

  get selectOptions() {
    if (this.isSelectField) {
      return (this.field() as SelectField).options;
    }
    return [];
  }
}
