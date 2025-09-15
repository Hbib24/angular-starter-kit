import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: false,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  icon = input.required<string>();
  size = input(24);

  _size = computed(() => `${this.size()}px`);
}
