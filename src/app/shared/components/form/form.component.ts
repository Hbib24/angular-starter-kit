import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormService } from '../../services/form.service';
import { FormGroup } from '@angular/forms';
import { FormField } from './fields/field';
import { TemplateField } from './fields/template-field';
import { AreaField } from './fields/area-field';

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
  inline = input<boolean>(false);
  fields = input.required<FormField[]>();
  loading = input<boolean>(false);
  showReset = input<boolean>(false);
  showSubmit = input<boolean>(true);
  formGroup = input<FormGroup>();

  _defaultValues = computed(() =>
    this.formService.getDefaultValues(this.fields())
  );
  _formId = computed(() => this.name().toLowerCase());
  _formGroup = computed(
    () => this.formGroup() || this.formService.create(this.fields())
  );
  _formWrapperId = computed(() => `${this.name().toLowerCase()}-wrapper`);

  onSubmit = output<any>();
  onReset = output<any>();
  onValueChanges = output<any>();

  formElementRef = viewChild<ElementRef>('form');
  labelWidth?: number;

  ngOnInit(): void {
    this._formGroup().valueChanges.subscribe(() => {
      this.onValueChanges.emit(this._formGroup().value);
    });
  }

  ngAfterViewInit(): void {
    if (this.inline()) {
      this.labelWidth = this.getWidestLabelWidth(this.formElementRef()) || 0;
      console.log(this.labelWidth);
    }
  }

  private getWidestLabelWidth(
    formRef?: ElementRef<HTMLFormElement | undefined>
  ): number {
    if (!formRef || !formRef.nativeElement) return 0;
    const form = formRef.nativeElement;
    const labels = Array.from(form.querySelectorAll('label'));

    if (labels.length === 0) return 0;

    let maxWidth = 0;

    for (const label of labels) {
      const width = label.offsetWidth;
      if (width > maxWidth) {
        maxWidth = width;
      }
    }

    return maxWidth;
  }

  getColSpan(field: FormField) {
    return `col-span-${field.colspan}`;
  }

  getHeight(field: FormField) {
    if (field instanceof TemplateField || field instanceof AreaField) {
      return '';
    }
    return 'h-[90px]';
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

  handleReset() {
    const defaultValues = this._defaultValues();
    const formattedValues = this.formService.formatValues(
      defaultValues,
      this.fields()
    );
    const formattedStructure =
      this.formService.handleNestedFields(formattedValues);
    this._formGroup().reset(formattedStructure);
    this.onReset.emit(formattedStructure);
  }
}
