import {
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { NzButtonShape, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit {
  icon = input<string>();
  text = input<string>();
  color = input<
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'simple'
    | string
  >('primary');

  _class = computed(
    () => 'btn-' + this.color() + ' !flex !gap-2 !items-center !justify-center '
  );
  statusButton = input<string>();

  iconSize = input(20);

  shape = input<NzButtonShape>(null);
  height = input(55);

  width = input(55);

  loading = input<boolean>(false);
  private internalLoading = signal(false);

  _loading = computed(() => this.loading() || this.internalLoading());
  danger = input<boolean>(false);
  disabled = input<boolean>(false);
  _disabled = computed(() => this.disabled() || this._loading());

  type = input<NzButtonType>('default');
  onClick = output<void>();
  ngOnInit() {
    if (!this.icon() && !this.text()) {
      throw new Error(
        'AppButton: You must provide at least one of [icon] or [text]'
      );
    }
  }
  async _onClick(): Promise<void> {
    if (this._disabled() || this._loading()) return;

    try {
      this.onClick.emit();
    } catch (error) {
      console.error('AppButton error', error);
    }
  }
}
