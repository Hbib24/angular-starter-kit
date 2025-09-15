import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

interface TrackedDrawer {
  ref: NzDrawerRef;
  onCancel?: () => void | Promise<void>;
}
export interface DrawerBaseOptions {
  title: string;
  width?: string;
  params?: any;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  extra?: string | TemplateRef<{}>;
  handleCancel?: () => void | Promise<void>;
}

export interface DrawerTemplateOptions extends DrawerBaseOptions {
  tplContent: TemplateRef<{ $implicit: any; drawerRef: NzDrawerRef<any> }>;
  tplFooter?: TemplateRef<{ $implicit: any; drawerRef: NzDrawerRef<any> }>;
}

export interface DrawerComponentOptions extends DrawerBaseOptions {
  component: Type<any>;
  contentParams?: any;
  footer?: string | TemplateRef<{}>;
}

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private activeDrawers: TrackedDrawer[] = [];

  nzDrawerService = inject(NzDrawerService);

  openTemplate(options: DrawerTemplateOptions): NzDrawerRef {
    const {
      title,
      tplContent,
      tplFooter,
      width = '550px',
      params,
      extra,
      placement,
      handleCancel,
    } = options;

    const drawerRef = this.nzDrawerService.create({
      nzTitle: title,

      nzContent: tplContent,
      nzFooter: tplFooter,
      nzExtra: extra,
      nzContentParams: params,
      nzWidth: width,
      nzPlacement: placement ?? 'right',

      nzOnCancel: async () => (handleCancel ? await handleCancel() : undefined),
    });

    drawerRef.afterOpen.subscribe(() => {
      (drawerRef as any)._containerInstance!.nzContentParams.drawerRef =
        drawerRef;
    });

    this.trackDrawer(drawerRef, options.handleCancel);
    return drawerRef;
  }

  openComponent(options: DrawerComponentOptions): NzDrawerRef {
    const {
      title,
      component,
      width = '550px',
      contentParams,
      extra,
      footer,
      placement,
      handleCancel,
    } = options;

    const drawerRef = this.nzDrawerService.create<any, any>({
      nzTitle: title,
      nzFooter: footer,
      nzExtra: extra,
      nzPlacement: placement ?? 'right',

      nzContent: component,
      nzContentParams: contentParams,
      nzWidth: width,

      nzOnCancel: async () => (handleCancel ? await handleCancel() : undefined),
    });

    this.trackDrawer(drawerRef, options.handleCancel);
    return drawerRef;
  }

  async closeAll(result?: any): Promise<void> {
    for (const { ref, onCancel } of this.activeDrawers) {
      if (onCancel) {
        // Wait if it returns a Promise
        await onCancel();
      }
      ref.close(result);
    }
    this.activeDrawers = [];
  }
  private trackDrawer(
    ref: NzDrawerRef,
    onCancel?: () => void | Promise<void>
  ): void {
    this.activeDrawers.push({ ref, onCancel });

    ref.afterClose.subscribe(() => {
      this.activeDrawers = this.activeDrawers.filter((d) => d.ref !== ref);
    });
  }
}
