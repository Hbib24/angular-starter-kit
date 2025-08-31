import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormFieldType } from './form';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: {
    class: 'form-wrapper',
    '[id]': 'formWrapperId()',
  },
})
export class FormComponent {
  formService = inject(FormService);

  name = input<string>();
  fields = input.required<FormFieldType[]>();

  form = computed(() => this.formService.create(this.fields(), this.name()));
  formId = computed(() => `${this.form().name.toLowerCase()}`);
  formWrapperId = computed(() => `${this.form().name.toLowerCase()}-wrapper`);
  formGroup = computed(() => this.form().formGroup);

  onSubmit = output<any>();

  handleSubmit() {
    if (this.formGroup().valid) {
      this.onSubmit.emit(this.formGroup().value);
    } else {
      this.formGroup().markAllAsDirty();
    }
  }
}
