import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartComponent } from '../base/base.component';
import { WebSocketService } from '../../../service/websocket.service';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-fire-prevention',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isConnected; else disconnected">
        <canvas #chartCanvas width="400" height="300"></canvas>
      </div>
      <ng-template #disconnected>
        <div class="connection-error">
          <p>No se pudo establecer conexión con los sensores de gases inflamables.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .chart-container {
      height: 300px;
      width: 100%;
      position: relative;
      margin: 0 auto;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .connection-error {
      padding: 16px;
      text-align: center;
      color: #dc3545;
      background-color: #f8d7da;
      border-radius: 4px;
    }
  `]
})
export class FirePreventionComponent extends BaseChartComponent {
  protected override chartType: ChartType = 'bar';
  protected override sensorLabels = ['Metano MQ-4', 'Gas Natural MQ-5'];
  protected override chartTitle = 'Concentración de Gases Inflamables';
  protected override sensorsToTrack = ['Metano MQ-4', 'Gas Natural MQ-5', 'MQ-4', 'MQ-5'];
  protected override backgroundColor = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)'
  ];
  protected override yAxisLabel = 'Concentración (ppm)';
  
  protected override sensorName = 'MQ-4';

  constructor(
    webSocketService: WebSocketService,
    ngZone: NgZone,
    cdr: ChangeDetectorRef
  ) {
    super(webSocketService, ngZone, cdr);
    console.log('🔥 FirePreventionComponent inicializado');
  }
}