import { Injectable, TemplateRef, inject } from '@angular/core';
import {
  NzNotificationService,
  NzNotificationRef,
  NzNotificationComponent,
} from 'ng-zorro-antd/notification';
import { NgClassInterface, NgStyleInterface } from 'ng-zorro-antd/core/types';

export type NotificationType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'blank';

export interface BaseNotificationOptions<Data = any> {
  id?: string;
  title: string | TemplateRef<void>;
  content?: string | TemplateRef<void>;
  type?: NotificationType;
  duration?: number; // ms, default 4500
  placement?:
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'top'
    | 'bottom';
  style?: NgStyleInterface;
  className?: NgClassInterface | string;
  pauseOnHover?: boolean;
  closeIcon?: TemplateRef<void> | string;
  buttons?:
    | TemplateRef<{
        $implicit: NzNotificationComponent;
      }>
    | undefined;
  data?: Data;
}

export interface NotificationOnScreen {
  id: string;
  type: NotificationType;
  ref: NzNotificationRef;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = new Map<string, NotificationOnScreen>();
  private nzNotification = inject(NzNotificationService);

  /** generic creator */
  private create(options: BaseNotificationOptions): NzNotificationRef {
    const id = options.id ?? crypto.randomUUID();

    const ref = this.nzNotification.create(
      options.type ?? 'blank',
      options.title,
      options.content ?? '',
      {
        nzDuration: options.duration ?? 4500,
        nzPlacement: options.placement ?? 'topRight',
        nzStyle: options.style,
        nzClass: options.className,
        nzPauseOnHover: options.pauseOnHover ?? true,
        nzAnimate: true,
        nzCloseIcon: options.closeIcon,
        nzButton: options.buttons,

        nzKey: id,
      }
    );

    this.notifications.set(id, { id, type: options.type ?? 'blank', ref });

    // remove from map when closed
    ref.onClose.subscribe(() => this.notifications.delete(id));

    return ref;
  }

  success = (opts: Omit<BaseNotificationOptions, 'type'>) =>
    this.create({ ...opts, type: 'success' });

  info = (opts: Omit<BaseNotificationOptions, 'type'>) =>
    this.create({ ...opts, type: 'info' });

  warning = (opts: Omit<BaseNotificationOptions, 'type'>) =>
    this.create({ ...opts, type: 'warning' });

  error = (opts: Omit<BaseNotificationOptions, 'type'>) =>
    this.create({ ...opts, type: 'error' });

  blank = (opts: Omit<BaseNotificationOptions, 'type'>) =>
    this.create({ ...opts, type: 'blank' });

  close(predicate?: string | ((n: NotificationOnScreen) => boolean)): void {
    for (const [id, n] of this.notifications) {
      if (
        !predicate ||
        (typeof predicate === 'string' ? id === predicate : predicate(n))
      ) {
        this.nzNotification.remove(id);
        this.notifications.delete(id);
      }
    }
  }

  closeAll(): void {
    this.nzNotification.remove();
    this.notifications.clear();
  }

  hasOpen(): boolean {
    return this.notifications.size > 0;
  }
  closeLast(): void {
    const last = Array.from(this.notifications.values()).pop();
    if (last) this.close(last.id);
  }
}
