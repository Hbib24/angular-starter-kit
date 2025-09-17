import { Component, computed, input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SelectOption } from '../form/fields/select-field';
import { FormField } from '../form/fields/field';
import { FieldAdapter } from '../../helpers/field-adapter';

@Component({
  selector: 'app-form-field',
  standalone: false,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  readonly field = input.required<FormField>();
  readonly form = input.required<FormGroup>();
  readonly highestLabelWidth = input<number>();
  readonly inline = input<boolean>(false);

  readonly control = computed(() => this.form().get(this.field().name));
  getValidationHint(field: any): string {
    const hint = field.validationHint;
    return typeof hint === 'string' ? hint.tr() : '';
  }
  ngOnInit() {
    this.adapter = new FieldAdapter(this.field());
    if (
      this.adapter.isSelectField ||
      this.adapter.isMultiSelectField ||
      this.adapter.isRadioField
    ) {
      this.handleSelectOptions();
    }
    if (this.adapter.isTextField) {
      this.handleAutoCompleteOptions();
    }
  }

  selectOptions: SelectOption[] = [];
  autoCompleteOptions: string[] = [];
  loading = false;
  softLoading = false;
  adapter!: FieldAdapter;

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

  get dateFormat() {
    switch (this.adapter.fieldAsDateField.type) {
      case 'date':
        return 'dd/MM/yyyy';
      case 'datetime':
        return 'dd/MM/yyyy HH:mm:ss';
      default:
        return '';
    }
  }

  disabledSeconds = () => {
    return !this.adapter.fieldAsTimeField.showSeconds
      ? new Array(60).fill(1).map((_, i) => i)
      : [];
  };

  async handleSelectOptions() {
    this.loading = true;
    const options = this.adapter.fieldAsSelectField.options;
    if (typeof options == 'function') {
      this.selectOptions = await options(this.form());
      this.field().dependencies.forEach((dependency: string) => {
        this.form()
          .get(dependency)
          ?.valueChanges.subscribe(async () => {
            this.loading = true;
            this.selectOptions = await options(this.form());
            this.control()?.reset();
            this.loading = false;
          });
      });
    } else {
      this.selectOptions = options;
    }
    this.loading = false;
  }

  async handleAutoCompleteOptions() {
    this.softLoading = true;
    const options = this.adapter.fieldAsTextField.autoCompleteOptions;
    const value = this.control()?.value;
    if (typeof options == 'function') {
      this.autoCompleteOptions = await options(value, this.form());
      const dependencies = [...this.field().dependencies, this.field().name];
      dependencies.forEach((dependency: string) => {
        this.form()
          .get(dependency)
          ?.valueChanges.subscribe(async () => {
            this.softLoading = true;
            const value = this.control()?.value;
            this.autoCompleteOptions = await options(value, this.form());
            this.softLoading = false;
          });
      });
    } else {
      this.autoCompleteOptions = options;
    }
    this.softLoading = false;
  }
}
