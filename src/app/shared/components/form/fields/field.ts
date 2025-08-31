import { TemplateRef } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { TemplateField } from './template-field';

export interface FieldOptions {
  name: string;
  label?: string | TemplateRef<any>;
  value?: any;
  placeholder?: string | TemplateRef<any>;
  required?: boolean | ((formGroup: FormGroup) => boolean);
  readonly?: boolean | ((formGroup: FormGroup) => boolean);
  visible?: boolean | ((formGroup: FormGroup) => boolean);
  hidden?: boolean | ((formGroup: FormGroup) => boolean);
  validators?: ValidatorFn[];
  validationHint?: string | TemplateRef<any>;
  hint?: string | TemplateRef<any>;
  /**
   * Number of columns this field should span in a grid layout.
   * Default is 24, meaning it will take the full width.
   */
  colspan?: number;
  /**
   * array representing field names that this field depends on
   * state will change based on the value of this dependency list
   *
   * REQUIRED IF USING CONDITIONAL REQUIRED, READONLY, VISIBILITY
   */
  dependencies?: string[];
  /**
   * Format the submitted value
   */
  formatValue?: (value: any) => any;
  onValueChange?: (value: any) => void;
}

export abstract class Field<T> {
  readonly name: string;
  readonly label?: string | TemplateRef<any>;
  value: T;
  readonly placeholder?: string | TemplateRef<any>;
  readonly required: boolean | ((formGroup: FormGroup) => boolean);
  readonly readonly: boolean | ((formGroup: FormGroup) => boolean);
  readonly visible: boolean | ((formGroup: FormGroup) => boolean);
  readonly hidden: boolean | ((formGroup: FormGroup) => boolean);
  readonly validators: ValidatorFn[];
  readonly validationHint?: string | TemplateRef<any>;
  readonly dependencies: string[];
  hint?: string | TemplateRef<any>;
  colspan: number;
  isTemplate = false;
  formatValue?: (value: any) => any;
  onValueChange?: (value: any) => void;

  constructor(options: FieldOptions) {
    this.name = options.name;
    this.label = options.label;
    this.value = options.value || null;
    this.placeholder = options.placeholder || options.label;
    this.required = options.required || false;
    this.readonly = options.readonly || false;
    this.visible = options.visible || true;
    this.hidden = options.hidden || false;
    this.validators = options.validators || [];
    this.validationHint = options.validationHint;
    this.hint = options.hint;
    this.colspan = options.colspan || 24;
    this.dependencies = options.dependencies || [];
    this.formatValue = options.formatValue;
    this.onValueChange = options.onValueChange;
  }

  isVisible(form: FormGroup) {
    const isVisible = this.visible;
    return (
      (typeof isVisible === 'function' ? isVisible(form) : isVisible) &&
      !this.isHidden(form)
    );
  }

  private isHidden(form: FormGroup) {
    const isHidden = this.hidden;
    return typeof isHidden === 'function' ? isHidden(form) : isHidden;
  }

  isReadonly(formGroup: FormGroup): boolean {
    const isReadonly =
      typeof this.readonly === 'function'
        ? this.readonly(formGroup)
        : this.readonly;
    return isReadonly;
  }

  isRequired(formGroup: FormGroup): boolean {
    const isRequired =
      typeof this.required === 'function'
        ? this.required(formGroup)
        : this.required;
    return isRequired;
  }
}
