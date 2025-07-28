import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="loading-container" [class.overlay]="overlay()">
      <div class="spinner-wrapper">
        <mat-spinner 
          [diameter]="diameter()" 
          [color]="color()">
        </mat-spinner>
        @if (message()) {
          <p class="loading-message">{{ message() }}</p>
        }
      </div>
    </div>
  `,
  styleUrl: './loading-spinner.scss'
})
export class LoadingSpinnerComponent {
  // Angular 20+ input signals
  message = input<string>('Loading...');
  diameter = input<number>(50);
  color = input<'primary' | 'accent' | 'warn'>('primary');
  overlay = input<boolean>(false);
}
