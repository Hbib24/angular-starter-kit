import { TemplateRef } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

export interface FieldOptions {
  name: string;
  label?: string | TemplateRef<any>;
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
   */
  dependencies?: string[];
  /**
   * Format the submitted value
   */
  formatValue?: (value: any) => any;
  onValueChange?: (value: any) => void;
}

export abstract class Field {
  name: string;
  label?: string | TemplateRef<any>;
  placeholder?: string | TemplateRef<any>;
  required: boolean | ((formGroup: FormGroup) => boolean);
  readonly: boolean | ((formGroup: FormGroup) => boolean);
  visible: boolean | ((formGroup: FormGroup) => boolean);
  hidden: boolean | ((formGroup: FormGroup) => boolean);
  validators: ValidatorFn[];
  validationHint?: string | TemplateRef<any>;
  hint?: string | TemplateRef<any>;
  colspan: number;
  dependencies: string[];
  formatValue?: (value: any) => any;
  onValueChange?: (value: any) => void;

  constructor(options: FieldOptions) {
    this.name = options.name;
    this.label = options.label;
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
}
