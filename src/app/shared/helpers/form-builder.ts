import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Form, FormFieldType } from '../components/form/form';
import { effect } from '@angular/core';

export class FormBuilder {
  static build(name: string, fields: FormFieldType[]): Form {
    const formGroup = this.createGroup(fields);

    fields.forEach((field: FormFieldType) => {
      this.handleRequired(formGroup, field);
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
      field.validators.forEach((validator) => {
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
      return;
    }

    field.dependencies.forEach((dependency) => {
      formGroup.get(dependency)?.valueChanges.subscribe(() => {
        const isRequired = this.isRequired(field, formGroup);
        console.log(isRequired);
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
