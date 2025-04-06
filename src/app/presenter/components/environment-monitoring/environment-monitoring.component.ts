import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart } from 'chart.js/auto'; // Esto asegura que los tipos de gráficos y plugins estén cargados
import { WebSocketService } from '../../../service/websocket.service';

@Component({
  selector: 'app-environment-monitoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './environment-monitoring.component.html',
  styleUrls: ['./environment-monitoring.component.scss']
})
export class EnvironmentMonitoringComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  // Estructura flexible que almacena los datos de sensores de forma dinámica
  private sensorData: { [key: string]: any } = {};

  constructor(private webSocketService: WebSocketService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      // Dentro de ngAfterViewInit
      this.webSocketService.getMessages().subscribe((data) => {
        const { name, data: payload } = data;
        const sensorData = payload?.['data'] as { [key: string]: number } | number;
      
        if (!name || sensorData === undefined) {
          console.warn('Datos inválidos recibidos:', data);
          return;
        }
      
        switch (name) {
          case 'BME-680':
            if (typeof sensorData !== 'object') return;
            if (!this.sensorData[name]) this.sensorData[name] = {};
            Object.keys(sensorData).forEach((key) => {
              if (!this.sensorData[name][key]) this.sensorData[name][key] = [];
              this.sensorData[name][key].push(sensorData[key]);
              if (this.sensorData[name][key].length > 10) {
                this.sensorData[name][key].shift();
              }
            });
            break;
      
            case 'Calidad Aire MQ-135':
              if (typeof sensorData !== 'number') return;
              if (!this.sensorData[name]) this.sensorData[name] = [];
              this.sensorData[name].push(sensorData);
              if (this.sensorData[name].length > 10) {
                this.sensorData[name].shift();
              }
              break;
          case 'Hidrogeno MQ-136':
            if (typeof sensorData !== 'number') return;
            if (!this.sensorData[name]) this.sensorData[name] = [];
            this.sensorData[name].push(sensorData);
            if (this.sensorData[name].length > 10) {
              this.sensorData[name].shift();
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
      type: 'line', // Tipo de gráfico
      data: {
        labels: Array(10).fill(''), // Etiquetas de ejemplo
        datasets: [] // Inicialización de datasets vacíos
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' // Posición de la leyenda
          }
        },
        scales: {
          x: {
            type: 'category', // Ejes de tipo 'categoría' para etiquetas
            ticks: {
              autoSkip: true, // Evita la superposición de etiquetas
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true // Inicia el eje Y en cero
          }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;

    // Recorremos todos los sensores y actualizamos los datasets
    Object.keys(this.sensorData).forEach((sensorName) => {
      const sensor = this.sensorData[sensorName];

      // Si el sensor es BME-680, actualizamos los datasets de cada clave de ese sensor
      if (sensorName === 'BME-680') {
        Object.keys(sensor).forEach((key) => {
          const existingDataset = this.chart?.data.datasets.find((dataset) => dataset.label === `${sensorName} - ${key}`);

          if (existingDataset) {
            // Si el dataset ya existe, solo agregamos el nuevo dato
            existingDataset.data = sensor[key];
          } else {
            // Si no existe, lo creamos
            this.chart?.data.datasets.push({
              label: `${sensorName} - ${key}`,
              data: sensor[key],
              borderColor: this.getRandomColor(),
              fill: false
            });
          }
        });
      } else {
        // Para otros sensores (como MQ-135), solo agregamos un único dataset
        const existingDataset = this.chart?.data.datasets.find((dataset) => dataset.label === sensorName);

        if (existingDataset) {
          // Si ya existe, actualizamos los datos
          existingDataset.data = sensor;
        } else {
          // Si no existe, lo creamos
          this.chart?.data.datasets.push({
            label: sensorName,
            data: sensor,
            borderColor: this.getRandomColor(),
            fill: false
          });
        }
      }
    });

    // Finalmente, actualizamos el gráfico
    this.chart.update();
  }


  // Función para generar un color aleatorio para cada línea en el gráfico
  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
