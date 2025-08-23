import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormComponent } from './components/form/form.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [FormComponent, FormFieldComponent, CardComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [FormComponent, CardComponent],
})
export class SharedModule {}
