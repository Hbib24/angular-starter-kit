import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { FormTestComponent } from './form-test/form-test.component';

const routes: Routes = [
  {
    path: 'test',
    component: IndexComponent,
    children: [
      {
        path: '',
        redirectTo: 'form',
        pathMatch: 'full',
      },
      { path: 'form', component: FormTestComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
