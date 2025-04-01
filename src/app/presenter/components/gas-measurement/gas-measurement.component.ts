import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { WebSocketService } from '../../../service/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gas-measurement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gas-measurement.component.html',
  styleUrl: './gas-measurement.component.scss'
})
export class GasMeasurementComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef;
  private chart?: Chart;
  private sensorSubscription?: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.sensorSubscription = this.webSocketService.getMessages().subscribe(data => {
      if (['MQ-7', 'CJMCU-811', 'MQ-136'].includes(data.sensor)) {
        this.updateChartData(data.sensor, data.value);
      }
    });
  }

  ngAfterViewInit() {
    if (this.chartCanvas) {
      this.createChart();
    }
  }

  private createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Carbono MQ-7', 'Carbono CJMCU-811', 'Hidrogeno MQ-136'],
        datasets: [{
          label: 'Concentración de gases',
          data: [0, 0, 0], 
          backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(153, 102, 255, 0.5)']
        }]
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

  private updateChartData(sensor: string, value: number) {
    if (!this.chart) return;

    const index = this.chart.data.labels?.indexOf(sensor);
    if (index !== undefined && index !== -1) {
      this.chart.data.datasets[0].data[index] = value;
      this.chart.update();
    }
  }

  ngOnDestroy() {
    this.sensorSubscription?.unsubscribe();
  }
}
