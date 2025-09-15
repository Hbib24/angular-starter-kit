import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  disabled = false;
  constructor() {
    this.normalFakeAction = this.normalFakeAction.bind(this);
    this.fakeActionAsync = this.fakeActionAsync.bind(this);
  }
  fakeActionAsync() {
    return new Promise<void>((resolve) => {
      console.log('Starting fake action...');
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
  normalFakeAction() {
    this.disabled = true;

    console.log('Normal action executed');
  }
}
