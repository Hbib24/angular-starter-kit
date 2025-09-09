import { Injectable } from '@angular/core';
import { FormBuilder } from '../helpers/form-builder';
import { FormField } from '../components/form/fields/field';
import { DatePipe } from '@angular/common';
import { DateField } from '../components/form/fields/date-field';
import { NumericField } from '../components/form/fields/numeric-field';

@Injectable()
export class FormService {
  create(fields: FormField[], name?: string) {
    const form = FormBuilder.build(fields);

    return form;
  }

  handleNestedFields(flat: Record<string, any>): { [key: string]: any } {
    const result: any = {};

    Object.keys(flat).forEach((key) => {
      const value = flat[key];
      const parts = key.split(':'); // e.g. 'user:username' -> ['user', 'username']
      console.log(parts);
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value; // assign the value to the last key
        } else {
          current[part] = current[part] || {}; // create intermediate object if needed
          current = current[part];
        }
      }
    });

    return result;
  }

  formatValues(values: any, fields: FormField[]): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    Object.keys(values).forEach((key) => {
      let value = values[key];
      const item = fields.find((filter) => filter.name === key);
      if (item instanceof DateField) {
        if (item?.endOfDay && item.type === 'date') {
          value = new DatePipe('en').transform(value, 'yyyy-MM-ddT23:59:59');
        } else {
          value = new DatePipe('en').transform(value, 'yyyy-MM-ddT00:00:00');
        }
      }

      if (item instanceof NumericField) {
        if (item.stringify && typeof value === 'number') {
          value = String(value);
        }
      }
      result[key] = value;
    });

    return result;
  }
}
