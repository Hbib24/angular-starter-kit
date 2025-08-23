import { Component } from '@angular/core';
import { TextField } from '../../shared/components/form/fields/text-field';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  onSubmit(data: any) {
    console.log('Form submitted:', data);
  }

  fields = [
    new TextField({
      label: 'Password',
      name: 'password',
      colspan: 6,
    }),
    new TextField({
      label: 'Password check',
      name: 'passwordcheck',
      colspan: 6,
      required: (formGroup) => {
        console.log(formGroup.get('password')?.value);
        return !!formGroup.get('password')?.value;
      },
      dependencies: ['password'],
    }),
  ];
}
