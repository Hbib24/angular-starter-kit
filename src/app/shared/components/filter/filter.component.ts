import {
  Component,
  computed,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormField } from '../form/fields/field';
import { FormBuilder } from '../../helpers/form-builder';
import { DrawerService } from '../../services/drawer.service';
import { FormService } from '../../services/form.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  drawerService = inject(DrawerService);
  formService = inject(FormService);

  fields = input.required<FormField[]>();
  showReset = input<boolean>(true);
  showSubmit = input<boolean>(true);
  primaryFields = input<string[]>([]);
  drawerRef?: NzDrawerRef;

  _primaryFields = computed(() => {
    return this.fields()
      .filter((field) => this.primaryFields().includes(field.name))
      .map((field) => {
        const clone = field.clone();
        clone.label = undefined;

        return clone;
      });
  });

  onFilter = output<any>();
  onReset = output<any>();
  onValueChanges = output<any>();

  primaryFormGroup = computed(() => FormBuilder.build(this._primaryFields()));
  formGroup = computed(() => FormBuilder.build(this.fields()));

  drawerTemplate = viewChild<TemplateRef<any>>('drawerTemplate');

  handlePrimaryValueChanges(values: any) {
    this.formGroup().setValue(
      { ...this.formGroup().value, ...values },
      { emitEvent: false }
    );

    this.onValueChanges.emit(values);
    this.handleSubmit(values);
  }

  get title() {
    return this.primaryFields().length ? 'Filtre avancé' : 'Filtre';
  }

  handleSubmit(values: any) {
    const primaryValues: { [key: string]: any } = {};
    this.primaryFields().forEach((key) => {
      primaryValues[key] = values[key];
    });
    this.primaryFormGroup().setValue(primaryValues, { emitEvent: false });
    this.close();
    this.onFilter.emit(values);
  }

  handleReset(values: any) {
    this.primaryFormGroup().reset(values);
    this.close();
    this.onReset.emit(values);
  }

  openFilter() {
    const template = this.drawerTemplate();

    if (template) {
      this.drawerRef = this.drawerService.openTemplate({
        title: this.title,
        tplContent: template,
        width: '350px',
      });
    }
  }

  close() {
    this.drawerRef?.close();
  }
}
