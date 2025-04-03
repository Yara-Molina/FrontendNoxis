import { Component, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartComponent } from '../base/base.component';
import { WebsocketService } from '../../../service/websocket.service';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-environment-monitoring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isConnected; else disconnected">
        <canvas #chartCanvas width="400" height="300"></canvas>
      </div>
      <ng-template #disconnected>
        <div class="connection-error">
          <p>No se pudo establecer conexión con el servidor de sensores ambientales.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 400px;
      height: 400px;
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
export class EnvironmentMonitoringComponent extends BaseChartComponent implements OnInit {
  protected override chartType: ChartType = 'bar';
  protected override sensorLabels = ['Calidad Aire', 'Presión', 'Temperatura', 'Humedad'];
  protected override chartTitle = 'Monitoreo Ambiental';

  // Aseguramos que ambos sensores sean monitoreados
  protected override sensorsToTrack = ['Calidad Aire MQ-135', 'Presion', 'Temperatura', 'Humedad'];

  protected override backgroundColor = [
    'rgba(54, 162, 235, 0.7)',  // Calidad de Aire (azul)
    'rgba(75, 192, 192, 0.7)',  // Presión (verde)
    'rgba(255, 99, 132, 0.7)',  // Temperatura (rojo)
    'rgba(153, 102, 255, 0.7)'  // Humedad (morado)
  ];

  

  protected override yAxisLabel = 'Valores';
  
  
  constructor(
    webSocketService: WebsocketService,
    ngZone: NgZone,
    cdr: ChangeDetectorRef
  ) {
    super(webSocketService, ngZone, cdr);
    console.log('🏁 EnvironmentMonitoringComponent inicializado.');
  }
  
  override ngOnInit() {
    console.log('🏁 EnvironmentMonitoringComponent ngOnInit ejecutado.');
    super.ngOnInit();
  }
}
