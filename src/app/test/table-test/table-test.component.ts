import { Component } from '@angular/core';
import { Column } from '../../shared/components/table/table.component';
import { delay, lastValueFrom, of } from 'rxjs';
import { Getter } from '../../shared/helpers/getter';
import { TextField } from '../../shared/components/form/fields/text-field';

@Component({
  selector: 'app-table-test',
  standalone: false,
  templateUrl: './table-test.component.html',
  styleUrl: './table-test.component.scss',
})
export class TableTestComponent {
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

  filterFields = [
    new TextField({
      name: 'name',
      label: 'name',
    }),
    new TextField({
      name: 'test',
      label: 'test',
      required: true,
    }),
  ];
}
