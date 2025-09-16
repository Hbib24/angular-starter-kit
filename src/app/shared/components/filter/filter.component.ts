import { Component, computed, input, output } from '@angular/core';
import { FormField } from '../form/fields/field';
import { FormBuilder } from '../../helpers/form-builder';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  fields = input.required<FormField[]>();
  showReset = input<boolean>(true);
  showSubmit = input<boolean>(true);
  primaryFields = input<string[]>([]);

  _primaryFields = computed(() => {
    return this.fields().filter((field) =>
      this.primaryFields().includes(field.name)
    );
  });

  onFilter = output<any>();
  onReset = output<void>();
  onValueChanges = output<any>();

  primaryFormGroup = computed(() => FormBuilder.build(this._primaryFields()));
  formGroup = computed(() => FormBuilder.build(this.fields()));

  handlePrimaryValueChanges(values: any) {
    values = { ...this.formGroup().value, ...values };
    this.formGroup().setValue(values, { emitEvent: false });

    this.onFilter.emit(values);
  }

  handleValueChanges(values: any) {
    const primaryValues: { [key: string]: any } = {};
    this.primaryFields().forEach((key) => {
      primaryValues[key] = values[key];
    });
    this.primaryFormGroup().setValue(primaryValues, { emitEvent: false });

    this.onValueChanges.emit(values);
  }

  handleSubmit() {
    this.onFilter.emit(this.formGroup().value);
  }
}
