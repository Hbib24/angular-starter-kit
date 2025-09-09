import { Component, computed, inject, input, output } from '@angular/core';
import { FormService } from '../../services/form.service';
import { Form, FormGroup } from '@angular/forms';
import { FormField } from './fields/field';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: {
    class: 'form-wrapper',
    '[id]': '_formWrapperId()',
  },
})
export class FormComponent {
  formService = inject(FormService);

  name = input<string>('form');
  fields = input.required<FormField[]>();
  loading = input<boolean>(false);
  showReset = input<boolean>(false);
  showSubmit = input<boolean>(true);
  formGroup = input<FormGroup>();

  _formId = computed(() => this.name().toLowerCase());
  _formGroup = computed(
    () => this.formGroup() || this.formService.create(this.fields())
  );
  _formWrapperId = computed(() => `${this.name().toLowerCase()}-wrapper`);

  onSubmit = output<any>();
  onReset = output<void>();
  onValueChanges = output<any>();

  ngOnInit(): void {
    this._formGroup().valueChanges.subscribe(() => {
      this.onValueChanges.emit(this._formGroup().value);
    });
  }

  getColSpan(field: FormField) {
    return `col-span-${field.colspan}`;
  }

  handleSubmit() {
    if (this._formGroup().valid) {
      const values = this._formGroup().value;
      const formattedValues = this.formService.formatValues(
        values,
        this.fields()
      );
      const formattedStructure =
        this.formService.handleNestedFields(formattedValues);
      this.onSubmit.emit(formattedStructure);
    } else {
      this._formGroup().markAllAsDirty();
    }
  }
}
