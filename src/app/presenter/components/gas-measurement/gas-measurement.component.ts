import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../service/websocket.service';
import { Chart } from 'chart.js';

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

  private sensorData: { [key: string]: any } = {
    'Carbono MQ-7': { value: [] },
    'Carbono CJMCU-811': { CO2: [], TVOC: [] }
  };

  constructor(private webSocketService: WebSocketService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      // Dentro de ngAfterViewInit
      this.webSocketService.getMessages().subscribe((data) => {
        const { name, data: sensorData }: { name: string; data: { CO2?: number; TVOC?: number; [key: string]: any } } = data;

        if (!name || !sensorData) {
          console.warn('Datos inválidos recibidos:', data);
          return;
        }

        switch (name) {
          case 'Carbono MQ-7':
            // Agregar el valor del sensor MQ-7
            if (!this.sensorData[name]) this.sensorData[name] = { value: [] };
            this.sensorData[name].value.push(sensorData['data']);
            if (this.sensorData[name].value.length > 10) {
              this.sensorData[name].value.shift(); // Limitar a los últimos 10 valores
            }
            break;
          case 'Carbono CJMCU-811':
            // Agregar los valores del sensor CJMCU-811
            if (!this.sensorData[name]) this.sensorData[name] = { CO2: [], TVOC: [] };
            this.sensorData[name].CO2.push(sensorData['data'].CO2);
            this.sensorData[name].TVOC.push(sensorData['data'].TVOC);
            if (this.sensorData[name].CO2.length > 10) {
              this.sensorData[name].CO2.shift(); // Limitar a los últimos 10 valores de CO2
            }
            if (this.sensorData[name].TVOC.length > 10) {
              this.sensorData[name].TVOC.shift(); // Limitar a los últimos 10 valores de TVOC
            }
            break;
          default:
            break; // Ignorar otros sensores
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
        labels: Array(10).fill(''), // Usar etiquetas vacías (puedes personalizarlas si lo deseas)
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

    // Limpiar los datasets antes de agregar nuevos datos
    this.chart.data.datasets = [];

    // Actualizar los datasets de los sensores
    if (this.sensorData['Carbono MQ-7']) {
      const mq7Dataset = {
        label: 'Carbono MQ-7',
        data: this.sensorData['Carbono MQ-7'].value,
        borderColor: this.getRandomColor(),
        fill: false
      };
      this.chart.data.datasets.push(mq7Dataset);
    }

    if (this.sensorData['Carbono CJMCU-811']) {
      // Agregar CO2 y TVOC como datasets separados
      const co2Dataset = {
        label: 'CO2 - Carbono CJMCU-811',
        data: this.sensorData['Carbono CJMCU-811'].CO2,
        borderColor: this.getRandomColor(),
        fill: false
      };
      const tvocDataset = {
        label: 'TVOC - Carbono CJMCU-811',
        data: this.sensorData['Carbono CJMCU-811'].TVOC,
        borderColor: this.getRandomColor(),
        fill: false
      };
      this.chart.data.datasets.push(co2Dataset, tvocDataset);
    }

    // Finalmente, actualizamos el gráfico
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
