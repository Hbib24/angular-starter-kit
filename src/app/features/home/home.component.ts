import { Component, inject } from '@angular/core';
import { TextField } from '../../shared/components/form/fields/text-field';
import { FormService } from '../../shared/services/form.service';
import { TemplateField } from '../../shared/components/form/fields/template-field';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  formService = inject(FormService);
  onSubmit(data: any) {
    console.log('Form submitted:', data);
  }

  fields = [
    new TextField({
      label: 'Password',
      name: 'password',
    }),
    new TextField({
      label: 'Password check',
      name: 'passwordcheck',
      visible: (formGroup) => {
        return formGroup.get('password')?.value;
      },
      required: true,
      dependencies: ['password'],
    }),
    new TemplateField({}),
  ];
}
