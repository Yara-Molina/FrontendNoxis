import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { WebSocketService } from '../../../service/websocket.service';

@Component({
  selector: 'app-gas-measurement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gas-measurement.component.html',
  styleUrls: ['./gas-measurement.component.scss']
})
export class GasMeasurementComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  private sensorData: { [key: string]: any } = {};

  constructor(private webSocketService: WebSocketService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      // Dentro de ngAfterViewInit
      this.webSocketService.getMessages().subscribe((data) => {
        const { name, data: sensorData } = data;

        if (!name || !sensorData) {
          console.warn('Datos inválidos recibidos:', data);
          return;
        }

        switch (name) {
          case 'Carbono MQ-7':
            // Valor único
            if (!this.sensorData[name]) this.sensorData[name] = { value: [] };
            this.sensorData[name].value.push(sensorData);
            if (this.sensorData[name].value.length > 10) {
              this.sensorData[name].value.shift();
            }
            break;
          case 'Carbono CJMCU-811':
            if (!this.sensorData[name]) this.sensorData[name] = {};
            Object.keys(sensorData).forEach((key) => {
              if (!this.sensorData[name][key]) this.sensorData[name][key] = [];
              this.sensorData[name][key].push(sensorData[key]);
              if (this.sensorData[name][key].length > 10) {
                this.sensorData[name][key].shift();
              }
            });
            break;

          default:
            return; // Ignorar sensores no pertenecientes
        }
        this.updateChart();
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
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            type: 'category',
            ticks: {
              autoSkip: true,
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;

    Object.keys(this.sensorData).forEach((sensorName) => {
      const sensor = this.sensorData[sensorName];

      Object.keys(sensor).forEach((key) => {
        const label = key === 'value' ? sensorName : `${sensorName} - ${key}`;
        const existingDataset = this.chart!.data.datasets.find(ds => ds.label === label);

        if (existingDataset) {
          existingDataset.data = sensor[key];
        } else {
          this.chart!.data.datasets.push({
            label,
            data: sensor[key],
            borderColor: this.getRandomColor(),
            fill: false
          });
        }
      });
    });

    this.chart.update();
  }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
