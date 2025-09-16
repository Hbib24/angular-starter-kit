import {
  inject,
  Injectable,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { NzModalRef, NzModalService, ModalOptions } from 'ng-zorro-antd/modal';

export type ModalType = 'info' | 'success' | 'error' | 'warning';

export interface BaseModalOptions<Data = any, Result = any, Comp = any> {
  id?: string;
  title: string | TemplateRef<{}>;
  content?: string | TemplateRef<{}>;
  icon?: string;
  width?: string | number;
  centered?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  okText?: string;
  cancelText?: string;
  data?: Data;
  canceledDisabled?: boolean;
  okDisabled?: boolean;
  draggable?: boolean;
  okLoading?: boolean;

  type?: ModalType;
  onOk?: () => any | Promise<any>;
  onCancel?: (ref: NzModalRef<Result>) => any | Promise<any>;

  /** Called before closing; return false to prevent close */
  beforeClose?: (ref: NzModalRef<Comp, Result>) => boolean | Promise<boolean>;
  /** Called after close */
  afterClose?: (result: Result | undefined) => void;
}

export interface TemplateModalOptions<Data = any, Result = any>
  extends BaseModalOptions<Data, Result> {
  tplContent: TemplateRef<any>;
  tplFooter?: TemplateRef<any>;
}

export interface ComponentModalOptions<Comp, Data = any, Result = any>
  extends BaseModalOptions<Data, Result> {
  component: Type<Comp>;
  viewContainerRef?: ViewContainerRef;
  params?: Data;
  footer?: string | TemplateRef<{}> | null;
  className?: string;
}

export interface ModalOnScreen<Result = any> {
  id: string;
  type: ModalType;
  ref: NzModalRef<Result>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals = new Map<string, ModalOnScreen>();

  modal = inject(NzModalService);

  /** Generic template-based modal */
  openTemplate<Data = any, Result = any>(
    opts: TemplateModalOptions<Data, Result>
  ): NzModalRef<Result> {
    const id = opts.id ?? crypto.randomUUID();
    const ref = this.modal.create<Result>({
      nzTitle: opts.title,
      nzContent: opts.tplContent,
      nzFooter: opts.tplFooter,
      nzIconType: opts.icon,
      nzData: opts.data,
      nzWidth: opts.width,
      nzCentered: opts.centered ?? true,
      nzClosable: opts.closable ?? true,
      nzMaskClosable: opts.maskClosable ?? false,
      nzOkText: opts.okText ?? 'OK',
      nzCancelText: opts.cancelText ?? 'Annuler',
      nzOkLoading: opts.okLoading,
      nzCancelDisabled: opts.canceledDisabled,
      nzOkDisabled: opts.okDisabled,
      nzDraggable: opts.draggable,

      nzOnOk: opts.onOk,
      nzOnCancel: (): void | Promise<any> => {
        return opts.onCancel ? opts.onCancel(ref) : undefined;
      },
    });

    this.track(ref, id, opts);
    return ref;
  }

  /** Generic component-based modal */
  openComponent<Comp, Data = any, Result = any>(
    opts: ComponentModalOptions<Comp, Data, Result>
  ): NzModalRef<Comp, Result> {
    const id = opts.id ?? crypto.randomUUID();
    const ref = this.modal.create<Comp, Data, Result>({
      nzTitle: opts.title,
      nzContent: opts.component,
      nzViewContainerRef: opts.viewContainerRef,
      nzData: opts.params,
      nzFooter: opts.footer ?? null,
      nzClassName: opts.className,
      nzIconType: opts.icon,
      nzWidth: opts.width,
      nzCentered: opts.centered ?? true,
      nzClosable: opts.closable ?? true,
      nzMaskClosable: opts.maskClosable ?? false,
      nzOkText: opts.okText ?? 'OK',

      nzOkLoading: opts.okLoading,
      nzCancelDisabled: opts.canceledDisabled,
      nzOkDisabled: opts.okDisabled,
      nzDraggable: opts.draggable,
      nzCancelText: opts.cancelText ?? 'Annuler',
    });

    this.track(ref, id, opts);
    return ref;
  }
  /** Promise-based simple modal for quick info/confirm */
  async openModal<Result = any>(
    options: Partial<BaseModalOptions<any, Result>> = {}
  ): Promise<Result | undefined> {
    return new Promise((resolve) => {
      const ref = this.modal.create<Result>({
        nzTitle: options.title,
        nzContent: options.content,
        nzCentered: options.centered ?? true,
        nzClosable: options.closable ?? true,
        nzMaskClosable: options.maskClosable ?? false,
        nzOkText: options.okText ?? 'OK',
        nzCancelText: options.cancelText ?? 'Annuler',
        nzOkLoading: options.okLoading,
        nzCancelDisabled: options.canceledDisabled,
        nzOkDisabled: options.okDisabled,
        nzDraggable: options.draggable,
        nzOnOk: () => {
          options.onOk?.();
          resolve(undefined);
        },

        nzOnCancel: () => {
          options.onCancel?.(ref);
          resolve(undefined);
        },
      });

      this.track(ref, options.id ?? crypto.randomUUID(), {
        ...options,
        title: options.title || 'Info',
      } as BaseModalOptions<any, Result>);
    });
  }

  close(predicate?: string | ((m: ModalOnScreen) => boolean)): void {
    for (const [id, modal] of this.modals) {
      if (
        !predicate ||
        (typeof predicate === 'string' ? id === predicate : predicate(modal))
      ) {
        modal.ref.destroy();
        this.modals.delete(id);
      }
    }
  }

  closeLast(): void {
    const last = Array.from(this.modals.values()).pop();
    if (last) this.close(last.id);
  }

  closeAll(): void {
    this.close();
  }

  hasOpenModals(): boolean {
    return this.modals.size > 0;
  }

  updateById(id: string, options: Partial<ModalOptions>): void {}

  private track<Comp = any, Result = any>(
    ref: NzModalRef<Comp, Result>,
    id: string,
    opts: BaseModalOptions<any, Result>
  ) {
    this.modals.set(id, { id, type: opts.type ?? 'info', ref });

    const originalDestroy = ref.destroy.bind(ref);
    ref.destroy = async (result?: Result) => {
      if (opts.beforeClose) {
        const allow = await opts.beforeClose(ref);
        if (!allow) return; // stop closing
      }
      originalDestroy(result);
    };

    ref.afterClose.subscribe((result) => {
      this.modals.delete(id);
      opts.afterClose?.(result);
    });
  }
  private createModal(
    options: Partial<BaseModalOptions> & { type: ModalType }
  ): NzModalRef {
    const id = options.id ?? crypto.randomUUID();
    let _options = {
      nzTitle: options.title,
      nzContent: options.content,
      nzCentered: options.centered ?? true,
      nzClosable: options.closable ?? true,
      nzMaskClosable: options.maskClosable ?? false,
      nzOkText: options.okText ?? 'OK',
      nzCancelText: options.cancelText ?? 'Annuler',
      nzOkLoading: options.okLoading,
      nzCancelDisabled: options.canceledDisabled,
      nzOkDisabled: options.okDisabled,
      nzDraggable: options.draggable,

      nzOnOk: () => options.onOk?.(),
    };
    let ref = null;
    if (options.type == 'info') {
      ref = this.modal.info(_options);
    } else if (options.type == 'success') {
      ref = this.modal.success(_options);
    } else if (options.type == 'error') {
      ref = this.modal.error(_options);
    } else if (options.type == 'warning') {
      ref = this.modal.warning(_options);
    } else {
      ref = this.modal.create(_options);
    }

    this.modals.set(id, { id, type: options.type, ref });
    return ref;
  }

  info = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'info' });
  success = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'success' });
  error = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'error' });
  warning = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'warning' });
}
