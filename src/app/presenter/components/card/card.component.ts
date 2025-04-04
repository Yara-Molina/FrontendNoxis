import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-card">
      <div class="custom-card-header">
        <h2>{{ title }}</h2>
      </div>
      <div class="custom-card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .custom-card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      margin-bottom: 1rem;
      overflow: hidden;
    }
    .custom-card-header {
      padding: 16px;
      background-color: #f7f9fc;
      border-bottom: 1px solid #e0e4e8;
    }
    .custom-card-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }
    .custom-card-content {
      padding: 16px;
    }
  `]
})
export class CardComponent {
  @Input() title: string = '';
}