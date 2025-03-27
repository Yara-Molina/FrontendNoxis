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

  chart?: Chart;

  ngAfterViewInit() {
    if (this.type === 'chart' && this.chartCanvas) {
      this.createChart();
    }
  }

  private createChart() {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [{
            label: 'Datos',
            data: [12, 19, 3, 5, 2],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }
}
