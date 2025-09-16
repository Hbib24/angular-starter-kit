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
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { IconComponent } from './components/icon/icon.component';
import { CurrencyDisplayComponent } from './components/currency-display/currency-display.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { DrawerService } from './services/drawer.service';
import { ModalService } from './services/modal.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ButtonComponent } from './components/button/button.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [
    FormComponent,
    FormFieldComponent,
    CardComponent,
    TableComponent,
    FilterComponent,
    IconComponent,
    CurrencyDisplayComponent,
    ButtonComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzTimePickerModule,
    NzSwitchModule,
    NzDrawerModule,
    NzModalModule,
    NzAutocompleteModule,
    NzSpinModule,
    NzRadioModule,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    FormService,
    HttpService,
    DrawerService,
    ModalService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  exports: [
    FormComponent,
    CardComponent,
    TableComponent,
    FilterComponent,
    IconComponent,
    CurrencyDisplayComponent,
    ButtonComponent,
  ],
})
export class SharedModule {}
