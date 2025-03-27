import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() type: 'chart' | 'notification' = 'chart';
  @ViewChild('chartCanvas') chartCanvas?: ElementRef;

  private chart?: Chart;

  ngAfterViewInit() {
    if (this.type === 'chart' && this.chartCanvas) {
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
        labels: ['Sensor1', 'Sensor2', 'Sensor3'],
        datasets: [{
          label: 'Datos de ejemplo',
          data: [65, 59, 80, 81, 56],
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
}