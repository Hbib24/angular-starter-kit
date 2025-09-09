import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormComponent } from './components/form/form.component';
import { CardComponent } from './components/card/card.component';
import { FormService } from './services/form.service';
import { HttpService } from './services/http.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from '../core/interceptors/auth-interceptor';
import { ListComponent } from './components/list/list.component';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';

@NgModule({
  declarations: [
    FormComponent,
    FormFieldComponent,
    CardComponent,
    ListComponent,
    TableComponent,
    FilterComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    FormService,
    HttpService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  exports: [FormComponent, CardComponent],
})
export class SharedModule {}
