import { Component, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-divider',
  standalone: false,
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
})
export class DividerComponent {
  nzType = input<'horizontal' | 'vertical'>('horizontal');

  nzDashed = input(false);

  nzText = input<string | TemplateRef<void> | undefined>(undefined);

  nzPlain = input(false);

  nzOrientation = input<'center' | 'left' | 'right'>('center');

  nzVariant = input<'solid' | 'dashed' | 'dotted'>('solid');

  nzSize = input<'small' | 'middle' | 'large'>('middle');
}
