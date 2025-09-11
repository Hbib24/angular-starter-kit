import { Component, input, output } from '@angular/core';
import { FormField } from '../form/fields/field';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  fields = input.required<FormField[]>();
  showReset = input<boolean>(false);
  showSubmit = input<boolean>(true);

  onFilter = output<any>();
  onReset = output<void>();
  onValueChanges = output<any>();
}
