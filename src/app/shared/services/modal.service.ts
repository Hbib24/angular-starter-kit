import {
  Injectable,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService, ModalOptions } from 'ng-zorro-antd/modal';

/** Extend when you need more modal “categories” */
export type ModalType = 'info' | 'success' | 'error' | 'warning';

export interface BaseModalOptions<TData = any, TResult = any, TComp = any> {
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
  data?: TData;
  type?: ModalType;
  onOk?: () => any | Promise<any>;
  onCancel?: (ref: NzModalRef<TResult>) => any | Promise<any>;

  /** Called before closing; return false to prevent close */
  beforeClose?: (ref: NzModalRef<TComp, TResult>) => boolean | Promise<boolean>;
  /** Called after close */
  afterClose?: (result: TResult | undefined) => void;
}

export interface TemplateModalOptions<TData = any, TResult = any>
  extends BaseModalOptions<TData, TResult> {
  tplContent: TemplateRef<any>;
  tplFooter?: TemplateRef<any>;
}

export interface ComponentModalOptions<TComp, TData = any, TResult = any>
  extends BaseModalOptions<TData, TResult> {
  component: Type<TComp>;
  viewContainerRef?: ViewContainerRef;
  params?: TData;
  footer?: string | TemplateRef<{}> | null;
  className?: string;
}

export interface ModalOnScreen<TResult = any> {
  id: string;
  type: ModalType;
  ref: NzModalRef<TResult>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals = new Map<string, ModalOnScreen>();

  constructor(private modal: NzModalService) {}

  /** Generic template-based modal */
  openTemplate<TData = any, TResult = any>(
    opts: TemplateModalOptions<TData, TResult>
  ): NzModalRef<TResult> {
    const id = opts.id ?? crypto.randomUUID();
    const ref = this.modal.create<TResult>({
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
      nzOnOk: opts.onOk,
      nzOnCancel: (): void | Promise<any> => {
        return opts.onCancel ? opts.onCancel(ref) : undefined;
      },
    });

    this.track(ref, id, opts);
    return ref;
  }

  /** Generic component-based modal */
  openComponent<TComp, TData = any, TResult = any>(
    opts: ComponentModalOptions<TComp, TData, TResult>
  ): NzModalRef<TComp, TResult> {
    const id = opts.id ?? crypto.randomUUID();
    const ref = this.modal.create<TComp, TData, TResult>({
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

      nzCancelText: opts.cancelText ?? 'Annuler',
    });

    this.track(ref, id, opts);
    return ref;
  }
  /** Promise-based simple modal for quick info/confirm */
  async openModal<TResult = any>(
    options: Partial<BaseModalOptions<any, TResult>> = {}
  ): Promise<TResult | undefined> {
    return new Promise((resolve) => {
      const ref = this.modal.create<TResult>({
        nzTitle: options.title,
        nzContent: options.content,
        nzCentered: options.centered ?? true,
        nzClosable: options.closable ?? true,
        nzMaskClosable: options.maskClosable ?? false,
        nzOkText: options.okText ?? 'OK',
        nzCancelText: options.cancelText ?? 'Annuler',
        nzOnOk: () => {
          options.onOk?.();
          resolve(undefined);
        },
        /*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Called when the modal is cancelled. The function takes
         * the modal ref as a parameter and should return a promise.
         * The promise is resolved with undefined when the modal is
         * closed.
         */
        /*******  c30b5815-6fed-459e-b922-420b9ae4dc83  *******/
        nzOnCancel: () => {
          options.onCancel?.(ref);
          resolve(undefined);
        },
      });

      this.track(ref, options.id ?? crypto.randomUUID(), {
        ...options,
        title: options.title || 'Info',
      } as BaseModalOptions<any, TResult>);
    });
  }

  /** Close modal(s) by id or predicate */
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

  /** Update modal options (title, width, etc.) at runtime */
  updateById(id: string, options: Partial<ModalOptions>): void {}

  private track<TComp = any, TResult = any>(
    ref: NzModalRef<TComp, TResult>,
    id: string,
    opts: BaseModalOptions<any, TResult>
  ) {
    this.modals.set(id, { id, type: opts.type ?? 'info', ref });

    // Optional beforeClose guard
    const originalDestroy = ref.destroy.bind(ref);
    ref.destroy = async (result?: TResult) => {
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

  /** Methods like NzModalService */
  info = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'info' });
  success = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'success' });
  error = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'error' });
  warning = (options: Partial<BaseModalOptions>) =>
    this.createModal({ ...options, type: 'warning' });
}
