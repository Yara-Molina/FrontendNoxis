import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { WebSocketService } from '../../../service/websocket.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-environment-monitoring',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './environment-monitoring.component.html',
  styleUrl: './environment-monitoring.component.scss'
})
export class EnvironmentMonitoringComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private sensorData: { [key: string]: number[] } = {
    'Calidad Aire MQ-135': [],
    'BME-680': []
  };

  constructor(private webSocketService: WebSocketService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      this.webSocketService.getMessages().subscribe(data => {
        if (this.sensorData[data.sensor]) {
          this.sensorData[data.sensor].push(data.value);
          if (this.sensorData[data.sensor].length > 10) {
            this.sensorData[data.sensor].shift();
          }
          this.updateChart();
        }
      });
    }, 0);
  }

  private createChart() {
    if (!this.chartCanvas?.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(10).fill(''),
        datasets: [
          { label: 'Calidad Aire MQ-135', data: [], borderColor: 'blue', fill: false },
          { label: 'BME-680', data: [], borderColor: 'green', fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;
    this.chart.data.datasets[0].data = this.sensorData['Calidad Aire MQ-135'];
    this.chart.data.datasets[1].data = this.sensorData['BME-680'];
    this.chart.update();
  }
}
