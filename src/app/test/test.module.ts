import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormTestComponent } from './form-test/form-test.component';
import { TestRoutingModule } from './test-routing.module';
import { IndexComponent } from './index/index.component';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@NgModule({
  declarations: [FormTestComponent, IndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    TestRoutingModule,
    RouterLink,
    NzButtonModule,
    NzMenuModule,
  ],
})
export class TestModule {}
