import { TemplateRef } from '@angular/core';

interface TemplateFieldOptions {
  /**
   * Ovrrides other content.
   */
  template?: TemplateRef<any>;
  label?: string | TemplateRef<any>;
  hint?: string | TemplateRef<any>;
  content?: string | TemplateRef<any>;
  /**
   * Number of columns this field should span in a grid layout.
   * Default is 24, meaning it will take the full width.
   */
  colSpan?: number;
}

export class TemplateField {
  template?: TemplateRef<any>;
  label?: string | TemplateRef<any>;
  hint?: string | TemplateRef<any>;
  content?: string | TemplateRef<any>;
  colSpan: number;

  constructor(options: TemplateFieldOptions) {
    this.template = options.template;
    this.label = options.label;
    this.hint = options.hint;
    this.content = options.content;
    this.colSpan = options.colSpan || 24;
  }
}
