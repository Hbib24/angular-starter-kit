import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormField } from '../components/form/fields/field';

export class FormBuilder {
  static build(fields: FormField[]) {
    const formGroup = this.createGroup(fields);

    fields.forEach((field: FormField) => {
      if (!field.isTemplate) {
        this.handleRequired(formGroup, field);
        this.handleReadonly(formGroup, field);
      }
      this.handleVisibility(formGroup, field);
    });

    return formGroup;
  }

  static createGroup(fields: FormField[]): FormGroup {
    const group = new FormGroup({});
    fields.forEach((field) => {
      if (!field.isTemplate) {
        group.addControl(field.name, this.createControl(field));
      }
    });
    return group;
  }

  static createControl(field: FormField): FormControl {
    let control = new FormControl(field.value);

    control = this.applyValidators(field, control);

    return control;
  }

  private static applyValidators(
    field: FormField,
    control: FormControl
  ): FormControl {
    if (field.validators && field.validators.length > 0) {
      field.validators.forEach((validator: ValidatorFn | ValidatorFn[]) => {
        control.addValidators(validator);
      });
    }

    return control;
  }

  private static handleRequired(formGroup: FormGroup, field: FormField): void {
    const control = formGroup.get(field.name);
    if (!control) return;

    if (field.isRequired(formGroup)) {
      control.addValidators(Validators.required);
    }

    field.dependencies.forEach((dependency: string) => {
      formGroup.get(dependency)?.valueChanges.subscribe(() => {
        const isRequired = field.isRequired(formGroup);
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

  private static handleReadonly(formGroup: FormGroup, field: FormField): void {
    const control = formGroup.get(field.name);
    if (!control) return;

    if (field.isReadonly(formGroup)) {
      control.disable({ emitEvent: false });
    }

    field.dependencies.forEach((dependency: string) => {
      formGroup.get(dependency)?.valueChanges.subscribe(() => {
        const isReadonly = field.isReadonly(formGroup);
        const isDisabled = control.disabled;

        if (isReadonly && !isDisabled) {
          control.disable({ emitEvent: false });
        } else if (!isReadonly && isDisabled) {
          control.enable({ emitEvent: false });
        }
      });
    });
  }

  private static handleVisibility(
    formGroup: FormGroup,
    field: FormField
  ): void {
    const control = formGroup.get(field.name);
    if (!control) return;

    if (!field.isVisible(formGroup)) {
      control.disable({ emitEvent: false });
    }

    field.dependencies.forEach((dependency: string) => {
      formGroup.get(dependency)?.valueChanges.subscribe(() => {
        if (field.isVisible(formGroup)) {
          control.enable({ emitEvent: false });
        } else {
          control.disable({ emitEvent: false });
        }
      });
    });
  }
}
