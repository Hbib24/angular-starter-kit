import { Component, input } from '@angular/core';
import { ImagesConstants } from '../../../core/const/images.constants';

@Component({
  selector: 'app-currency-display',
  standalone: false,
  templateUrl: './currency-display.component.html',
  styleUrl: './currency-display.component.scss',
})
export class CurrencyDisplayComponent {
  ImagesConstants = ImagesConstants;
  isoCode = input.required<string>();
  displayText = input<boolean>(true);
}
