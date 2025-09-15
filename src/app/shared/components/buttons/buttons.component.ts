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
  selector: 'app-buttons',
  standalone: false,
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class ButtonsComponent implements OnInit {
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
  action = input<() => void | Promise<void>>();
  actionEvent = output<void>();

  ngOnInit() {
    if (!this.icon() && !this.text()) {
      throw new Error(
        'AppButton: You must provide at least one of [icon] or [text]'
      );
    }
  }
  onClick(): void {
    const fn = this.action();
    if (!fn) {
      this.actionEvent.emit();
      return;
    }

    try {
      const result = fn();
      if (result instanceof Promise) {
        // automatically handle internal loading
        this.internalLoading.set(true);
        result
          .finally(() => this.internalLoading.set(false))
          .then(() => this.actionEvent.emit())
          .catch((err) => {
            this.internalLoading.set(false);
            console.error('AppButton action failed', err);
          });
      } else {
        this.actionEvent.emit();
      }
    } catch (err) {
      console.error('AppButton action threw an error', err);
    }
  }
}
