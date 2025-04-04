import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { WebSocketService } from '../../../service/websocket.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-fire-prevention',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './fire-prevention.component.html',
  styleUrl: './fire-prevention.component.scss'
})
export class FirePreventionComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef;
  private chart?: Chart;
  private sensorSubscription?: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.sensorSubscription = this.webSocketService.getMessages().subscribe(data => {
      if (data.sensor === 'Metano MQ-4' || data.sensor === 'Gas Natural MQ-5') {
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
        labels: ['Metano MQ-4', 'Gas Natural MQ-5'],
        datasets: [{
          label: 'Concentración de gas',
          data: [0, 0], 
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)']
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
