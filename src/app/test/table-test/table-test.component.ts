import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Column } from '../../shared/components/table/table.component';
import { delay, lastValueFrom, of } from 'rxjs';
import { Getter } from '../../shared/helpers/getter';
import { DrawerService } from '../../shared/services/drawer.service';
import { ModalService } from '../../shared/services/modal.service';
import { TemplateField } from '../../shared/components/form/fields/template-field';
import { TextField } from '../../shared/components/form/fields/text-field';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-table-test',
  standalone: false,
  templateUrl: './table-test.component.html',
  styleUrl: './table-test.component.scss',
})
export class TableTestComponent {
  drawerService = inject(DrawerService);
  modalService = inject(ModalService);
  columns: Column[] = [
    {
      key: 'id',
      fixed: 'left',
      format: (value: any) => `#${value}`,

      label: 'ID',
    },
    {
      key: 'currency',
      type: 'currency',

      label: 'currency',
    },
    {
      key: 'amount',

      hidden: true,

      label: 'amount',
    },
    {
      key: 'price',

      label: 'price',
    },
    {
      key: 'testObj.secondLevel.value',

      label: 'testLevel2',
    },
    {
      key: 'counterValue',
      label: 'counterValue',
      fixed: 'right',
    },
    //created at
    {
      key: 'createdAt',
      type: 'time',

      label: 'createdAt',
    },
    {
      key: 'action',
      fixed: 'right',

      label: 'action',
    },
  ];
  data = Array.from({ length: 1000 }).map((_, i) => ({
    id: i + 1,
    createdAt: new Date().toISOString(),
    currency: 'usd',
    testObj: {
      secondLevel: {
        value: 'test3Valeutest3Valeutest3Valeu',
      },
    },
    amount: Math.floor(Math.random() * 100010001000100010001000),
    price: Math.floor(Math.random() * 100010001000100010001000),
    counterValue: Math.floor(Math.random() * 10100010001000100000),
  }));

  getFakeData: Getter = (params?: any) => {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 100;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return lastValueFrom(
      of({
        count: this.data.length + 30,
        data: this.data.slice(startIndex, endIndex),
      }).pipe(delay(0))
    );
  };

  @ViewChild('myFooterTemplateRef', { static: true })
  myFooterTemplateRef!: TemplateRef<any>;
  @ViewChild('myTemplateRef', { static: true })
  myTemplateRef!: TemplateRef<any>;
  @ViewChild('myTemplateRefModal', { static: true })
  myTemplateRefModal!: TemplateRef<any>;
  @ViewChild('myFooterTemplateModal', { static: true })
  myFooterTemplateModal!: TemplateRef<any>;

  filter() {
    const ref = this.drawerService.openComponent({
      title: 'My Drawer component',
      component: TableTestComponent,
      extra: 'hakim',
      params: { value: 123 },
      footer: this.myFooterTemplateRef,
      handleCancel: async () => {
        console.log('Cancel clicked. Drawer ref:', ref);
        await this.getFakeData();
      },
    });
  }
  close() {
    this.drawerService.closeAll();
  }

  filterTemplate(tpl: any, footerTpl: any) {
    this.myTemplateRef = tpl;
    this.myFooterTemplateRef = footerTpl;
    this.drawerService.openTemplate({
      title: 'My Drawer template',
      tplContent: this.myTemplateRef,
      tplFooter: this.myFooterTemplateRef,
      params: { value: 123 },
    });
  }

  async openInfoModal() {
    const result = await this.modalService.info({
      title: 'Info Modal',
      content: 'This is an info modal',
      type: 'info',
      okDisabled: true,
      okLoading: true,

      onOk: () => console.log('OK clickedclickedclicked'),
      onCancel: () => console.log('Cancel clicked'),
    });
  }

  onFilter(values: any) {
    // console.log(values);
  }

  openTemplateModal() {
    const modalRef = this.modalService.openTemplate({
      title: 'Template Modal',
      icon: 'info-circle',
      tplContent: this.myTemplateRefModal,
      width: '800px',

      tplFooter: this.myFooterTemplateModal,
      data: { name: 'Hakim' },
      onOk: () => console.log('OK clicked on template'),
      onCancel: (ref) => ref.destroy(),
    });
  }

  openComponentModal() {
    const modalRef = this.modalService.openComponent<
      TableTestComponent,
      { name: string },
      void
    >({
      title: 'User Modal',
      component: TableTestComponent,
      params: { name: 'Hakim' },
      okText: 'Close',
    });
  }

  filterFields = [
    new TextField({
      name: 'name',
      label: 'name',
      validators: [Validators.required, Validators.email],
      validationHint: this.myTemplateRefModal,
    }),
    new TextField({
      name: 'test',
      value: 'test',
      label: 'test',
      required: true,
    }),
  ];
}
