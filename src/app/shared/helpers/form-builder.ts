import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Form, FormFieldType } from '../components/form/form';

export class FormBuilder {
  static build(name: string, fields: FormFieldType[]): Form {
    const formGroup = this.createGroup(fields);

    fields.forEach((field: FormFieldType) => {
      this.handleRequired(formGroup, field);
      this.handleReadonly(formGroup, field);
    });

    return new Form(name, fields, formGroup);
  }

  static createGroup(fields: FormFieldType[]): FormGroup {
    const group = new FormGroup({});
    fields.forEach((field) => {
      group.addControl(field.name, this.createControl(field));
    });
    return group;
  }

  static createControl(field: FormFieldType): FormControl {
    let control = new FormControl(field.value);

    control = this.applyValidators(field, control);

    return control;
  }

  private static applyValidators(
    field: FormFieldType,
    control: FormControl
  ): FormControl {
    if (field.validators && field.validators.length > 0) {
      field.validators.forEach((validator: ValidatorFn | ValidatorFn[]) => {
        control.addValidators(validator);
      });
    }

    return control;
  }

  private static handleRequired(
    formGroup: FormGroup,
    field: FormFieldType
  ): void {
    const control = formGroup.get(field.name);
    if (!control) return;

    if (this.isRequired(field, formGroup)) {
      control.addValidators(Validators.required);
    }

    field.dependencies.forEach((dependency: string) => {
      formGroup.get(dependency)?.valueChanges.subscribe(() => {
        const isRequired = this.isRequired(field, formGroup);
        const hasRequiredValidator = control.hasValidator(Validators.required);

        if (isRequired && !hasRequiredValidator) {
          control.addValidators(Validators.required);
          control.updateValueAndValidity({ emitEvent: false });
        } else if (!isRequired && hasRequiredValidator) {
          control.removeValidators(Validators.required);
          control.updateValueAndValidity({ emitEvent: false });
        }
      });
    });
  }

  private static handleReadonly(
    formGroup: FormGroup,
    field: FormFieldType
  ): void {
    const control = formGroup.get(field.name);
    if (!control) return;

    if (this.isReadonly(field, formGroup)) {
      control.disable({ emitEvent: false });
    }

    field.dependencies.forEach((dependency: string) => {
      formGroup.get(dependency)?.valueChanges.subscribe(() => {
        const isReadonly = this.isReadonly(field, formGroup);
        const isDisabled = control.disabled;

        if (isReadonly && !isDisabled) {
          control.disable({ emitEvent: false });
        } else if (!isReadonly && isDisabled) {
          control.enable({ emitEvent: false });
        }
      });
    });
  }

  private static isReadonly(
    field: FormFieldType,
    formGroup: FormGroup
  ): boolean {
    const isReadonly =
      typeof field.readonly === 'function'
        ? field.readonly(formGroup)
        : field.readonly;
    return isReadonly;
  }

  private static isRequired(
    field: FormFieldType,
    formGroup: FormGroup
  ): boolean {
    const isRequired =
      typeof field.required === 'function'
        ? field.required(formGroup)
        : field.required;
    return isRequired;
  }
}
