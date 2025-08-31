import { effect, Injectable } from '@angular/core';
import { FormBuilder } from '../helpers/form-builder';
import { Form, FormFieldType } from '../components/form/form';
import { FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FormService {
  private readonly forms: Map<string, Form> = new Map();

  create(fields: FormFieldType[], name?: string) {
    name = name || this.generateName();
    const form = FormBuilder.build(name, fields);

    if (this.doesExist(name)) this.throwAlreadyExists(name);

    this.forms.set(name, form);
    return form;
  }

  remove(name: string) {
    if (!this.doesExist(name)) this.throwDoesNotExist(name);

    this.forms.delete(name);
  }

  get(name: string) {
    if (!this.doesExist(name)) this.throwDoesNotExist(name);

    return this.forms.get(name);
  }

  getLast() {
    return Array.from(this.forms.values()).pop();
  }

  getAll() {
    return Array.from(this.forms.values());
  }

  getCount(): number {
    return this.forms.size;
  }

  clear(): void {
    this.forms.clear();
  }

  doesExist(name: string): boolean {
    return this.forms.has(name);
  }

  get isEmpty(): boolean {
    return this.forms.size === 0;
  }

  private generateName(): string {
    return `form-${this.getCount() + 1}`;
  }

  private throwDoesNotExist(name: string): never {
    throw new Error(`Form with name ${name} does not exist.`);
  }

  private throwAlreadyExists(name: string): never {
    throw new Error(`Form with name ${name} already exists.`);
  }
}
