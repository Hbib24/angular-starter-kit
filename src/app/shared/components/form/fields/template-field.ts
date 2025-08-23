import { TemplateRef } from '@angular/core';
import { Field } from './field';

interface TemplateFieldOptions {
  /**
   * Ovrrides all other content.
   */
  template?: TemplateRef<any>;
  label?: string | TemplateRef<any>;
  hint?: string | TemplateRef<any>;
  /**
   * is the input block only.
   */
  content?: string | TemplateRef<any>;
  /**
   * Number of columns this field should span in a grid layout.
   * Default is 24, meaning it will take the full width.
   */
  colSpan?: number;
  visible?: boolean;
  hidden?: boolean;
}

export class TemplateField extends Field {
  template?: TemplateRef<any>;
  content?: string | TemplateRef<any>;
  value = null;

  constructor(options: TemplateFieldOptions) {
    super({
      name: 'template',
      label: options.label,
      hint: options.hint,
      colspan: options.colSpan,
      visible: options.visible,
      hidden: options.hidden,
    });

    this.template = options.template;
    this.content = options.content;
  }
}
