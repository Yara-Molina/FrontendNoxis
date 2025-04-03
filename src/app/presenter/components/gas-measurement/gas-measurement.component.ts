import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartComponent } from '../base/base.component';
import { WebsocketService } from '../../../service/websocket.service';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-gas-measurement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isConnected; else disconnected">
        <canvas #chartCanvas width="400" height="300"></canvas>
      </div>
      <ng-template #disconnected>
        <div class="connection-error">
          <p>No se pudo establecer conexión con los sensores de gases tóxicos.</p>
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
export class GasMeasurementComponent extends BaseChartComponent {
  protected override chartType: ChartType = 'bar';
  protected override sensorLabels = ['Carbono MQ-7', 'Carbono CJMCU-811', 'Hidrógeno MQ-136'];
  protected override chartTitle = 'Concentración de Gases Tóxicos';
  protected override sensorsToTrack = ['MQ-7', 'CJMCU-811', 'MQ-136', 'Carbono MQ-7', 'Carbono CJMCU-811', 'Hidrógeno MQ-136'];
  protected override backgroundColor = [
    'rgba(75, 192, 192, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(153, 102, 255, 0.5)'
  ];
  protected override yAxisLabel = 'Concentración (ppm)';
  
  // Especifica el sensor para este componente
  protected override sensorName = 'MQ-7';

  constructor(
    webSocketService: WebsocketService,
    ngZone: NgZone,
    cdr: ChangeDetectorRef
  ) {
    super(webSocketService, ngZone, cdr);
    console.log('☁️ GasMeasurementComponent inicializado');
  }
}