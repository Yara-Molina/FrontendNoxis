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
  @ViewChild('chartCanvas', { static: false }) chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private sensorSubscription?: Subscription;

  // Estructura para almacenar datos de sensores
  private sensorData: { [key: string]: number } = {
    'Metano MQ-4': 0,
    'Gas Natural MQ-5': 0
  };

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    console.log('Fire Prevention Component Initialized');

    this.sensorSubscription = this.webSocketService.getMessages().subscribe({
      next: (data) => {
        const { name, data: value } = data;

        switch (name) {
          case 'Metano MQ-4':
          case 'Gas Natural MQ-5':
            this.updateChartData(name, Number(value));
            break;

          default:
            // Ignora sensores no relacionados con fuego
            break;
        }
      },
      error: (err) => {
        console.error('Error en WebSocket:', err);
      }
    });
  }

  ngAfterViewInit() {
    if (this.chartCanvas) {
      this.createChart();
    }
  }

  private createChart() {
    if (this.chart) {
      this.chart.destroy(); // Destruir el gráfico existente
    }

    if (!this.chartCanvas?.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto del canvas');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Metano MQ-4', 'Gas Natural MQ-5'],
        datasets: [{
          label: 'Concentración de gas',
          data: [
            this.sensorData['Metano MQ-4'],
            this.sensorData['Gas Natural MQ-5']
          ],
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private updateChartData(sensor: string, value: number) {
    if (!this.chart) return;

    console.log(`Actualizando datos del sensor ${sensor} con valor ${value}`);

    this.sensorData[sensor] = value;

    const metanoValue = this.sensorData['Metano MQ-4'];
    const gasValue = this.sensorData['Gas Natural MQ-5'];

    if (typeof metanoValue !== 'number' || typeof gasValue !== 'number') {
      console.error('Datos de sensores inválidos:', this.sensorData);
      return;
    }

    this.chart.data.datasets[0].data = [metanoValue, gasValue];
    this.chart.update();
  }

  ngOnDestroy() {
    this.sensorSubscription?.unsubscribe();
  }
}
