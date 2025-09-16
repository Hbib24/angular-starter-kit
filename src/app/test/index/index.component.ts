import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  disabled = false;
  loading = false;

  fakeActionAsync() {
    this.loading = true;
    return new Promise<void>((resolve) => {
      console.log('Starting fake action...');
      setTimeout(() => {
        resolve();
        this.loading = false;
      }, 2000);
    });
  }
  normalFakeAction() {
    this.disabled = true;

    console.log('Normal action executed');
  }
}
