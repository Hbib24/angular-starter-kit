import { TemplateRef } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TemplateField } from './template-field';
import { MultiSelectField } from './multi-select-field';
import { NumericField } from './numeric-field';
import { SelectField } from './select-field';
import { TextField } from './text-field';
import { CheckField } from './check-field';
import { DateField } from './date-field';
import { TimeField } from './time-field';
import { AreaField } from './area-field';

export type FormField =
  | NumericField
  | TextField
  | SelectField
  | MultiSelectField
  | TemplateField
  | CheckField
  | DateField
  | TimeField
  | AreaField;

export interface FieldOptions {
  /**
   * Separate with ':' for nested fields
   */
  name: string;
  label?: string | TemplateRef<any>;
  value?: any;
  placeholder?: string;
  required?: boolean | ((formGroup: FormGroup) => boolean);
  readonly?: boolean | ((formGroup: FormGroup) => boolean);
  visible?: boolean | ((formGroup: FormGroup) => boolean);
  hidden?: boolean | ((formGroup: FormGroup) => boolean);
  validators?: ((formGroup: FormGroup) => ValidatorFn[]) | ValidatorFn[];
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
  showFeedback?: boolean;
  /**
   * Format the submitted value
   */
  formatValue?: (value: any) => any;
  onValueChange?: (value: any, control: FormControl) => void;
}

export abstract class Field<T> {
  name: string;
  label?: string | TemplateRef<any>;
  value: T;
  placeholder?: string;
  required: boolean | ((formGroup: FormGroup) => boolean);
  readonly: boolean | ((formGroup: FormGroup) => boolean);
  visible: boolean | ((formGroup: FormGroup) => boolean);
  hidden: boolean | ((formGroup: FormGroup) => boolean);
  validators: ((formGroup: FormGroup) => ValidatorFn[]) | ValidatorFn[];
  validationHint?: string | TemplateRef<any>;
  dependencies: string[];
  showFeedback: boolean;
  hint?: string | TemplateRef<any>;
  colspan: number;
  isTemplate = false;
  formatValue?: (value: any) => any;
  onValueChange?: (value: any, control: FormControl) => void;

  constructor(options: FieldOptions) {
    this.name = options.name;
    this.label = options.label;
    this.value = options.value || null;
    this.placeholder =
      options.placeholder || (typeof this.label === 'string' ? this.label : '');
    this.required = options.required || false;
    this.readonly = options.readonly || false;
    this.visible = options.visible === undefined ? true : options.visible;
    this.hidden = options.hidden || false;
    this.validators = options.validators || [];
    this.validationHint = options.validationHint;
    this.hint = options.hint;
    this.colspan = options.colspan || 24;
    this.dependencies = options.dependencies || [];
    this.showFeedback =
      options.showFeedback === undefined ? true : options.showFeedback;
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
