import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';
import { WebSocketService } from '../../../service/websocket.service';

// Registrar todos los componentes necesarios de Chart.js
Chart.register(...registerables);

@Component({
  template: ''
})
export abstract class BaseChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  protected abstract chartType: ChartType;
  protected abstract sensorLabels: string[];
  protected abstract chartTitle: string;
  protected abstract sensorsToTrack: string[];
  protected abstract backgroundColor: string[];
  protected abstract yAxisLabel: string;

  protected sensorName: string = '';

  protected chart: Chart | null = null;
  protected isConnected = false;
  protected chartData: ChartData | null = null;

  private messageSubscription: Subscription | null = null;
  private connectionSubscription: Subscription | null = null;
  private chartInitTimer: any = null;

  constructor(
    protected webSocketService: WebSocketService,
    protected ngZone: NgZone,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const sensorToUse = this.sensorName || (this.sensorsToTrack && this.sensorsToTrack.length > 0 ? this.sensorsToTrack[0] : 'default');

    console.log(`🔄 Iniciando conexión WebSocket para: ${sensorToUse}`);

    this.connectionSubscription = this.webSocketService.connect(sensorToUse).subscribe(connected => {
      this.isConnected = connected;
      console.log(`🔌 Estado de conexión WebSocket: ${connected}`);

      if (connected) {
        this.subscribeToMessages();
        // No inicializar la gráfica aquí, esperamos a ngAfterViewInit
      }
    });
  }

  ngAfterViewInit(): void {
    console.log("🎨 Verificando canvas...", this.chartCanvas);

    // Esperar un poco para que Angular termine de renderizar la vista
    this.chartInitTimer = setTimeout(() => {
      if (this.chartCanvas) {
        console.log("🖼 Canvas está disponible, inicializando gráfica...");
        this.initChart();
      } else {
        console.error("❌ Error: chartCanvas no está disponible después del timeout");
      }
      this.cdr.detectChanges(); // Forzar detección de cambios
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    if (this.chartInitTimer) {
      clearTimeout(this.chartInitTimer);
    }
    this.webSocketService.disconnect();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  protected initChart(): void {
    console.log("📊 Intentando inicializar gráfica...");

    if (!this.chartCanvas) {
      console.error('Chart canvas not found');
      return;
    }

    const canvas = this.chartCanvas.nativeElement;
    console.log("Canvas element:", canvas);

    if (!canvas) {
      console.error('Canvas element is null or undefined');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    console.log("📊 Inicializando gráfica con contexto:", ctx);

    // Inicializar chartData
    this.chartData = {
      labels: this.sensorLabels,
      datasets: [{
        label: this.chartTitle,
        data: this.sensorsToTrack.map(() => 0), // Inicializar con ceros
        backgroundColor: this.backgroundColor,
        borderColor: this.backgroundColor.map(color => color.replace('0.5', '1')),
        borderWidth: 1,
        tension: 0.4 // Para líneas suaves si es un gráfico de línea
      }]
    };

    try {
      this.ngZone.runOutsideAngular(() => {
        if (this.chart) {
          this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
          type: this.chartType,
          data: this.chartData!,
          options: this.getChartOptions()
        });

        console.log("✅ Gráfica inicializada correctamente");
      });
    } catch (error) {
      console.error("Error al crear la gráfica:", error);
    }
  }

  protected getChartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: this.chartTitle,
          font: {
            size: 16
          }
        },
        legend: {
          display: true
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: 0, // Mínimo sugerido para mejor visibilidad
          suggestedMax: 1000, // Máximo sugerido (ajústalo según tus datos)
          title: {
            display: true,
            text: this.yAxisLabel
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tiempo'
          },
          ticks: {
            autoSkip: true, // Evita que las etiquetas de tiempo se sobrecarguen
            maxTicksLimit: 5 // Solo muestra 5 etiquetas en el eje X
          }
        }
      },
      animation: { // Hace la animación más rápida
        easing: "easeInOutQuad"
      }
    };
  }

  protected subscribeToMessages(): void {
    console.log("🔄 Suscribiéndose a mensajes WebSocket");
    this.messageSubscription = this.webSocketService.getMessages().subscribe(message => {
      console.log("📡 Datos recibidos del WebSocket:", message);
      if (message) {
        this.updateChartData(message);
      }
    });
  }

  protected updateChartData(message: any): void {
    if (!this.chart || !message) {
      console.log("⚠ No se puede actualizar: chart o message no disponibles");
      return;
    }

    console.log("📊 Intentando actualizar gráfica con:", message);

    this.ngZone.run(() => {
      if (this.chart?.data?.datasets?.[0]) {
        const dataset = this.chart.data.datasets[0];

        // Actualizar solo los sensores presentes en el mensaje
        this.sensorsToTrack.forEach((sensor, index) => {
          if (message[sensor] !== undefined) {
            dataset.data[index] = message[sensor]; // Actualiza solo el sensor que llegó
            console.log(`📡 Sensor ${sensor} actualizado con: ${message[sensor]}`);
          }
        });

        // Agregar una nueva etiqueta de tiempo
        const currentTime = new Date().toLocaleTimeString();
        if (this.chart.data.labels) {
          this.chart.data.labels.push(currentTime);
          if (this.chart.data.labels.length > 10) {
            this.chart.data.labels.shift();
          }
        }

        this.chart.update();
        console.log("✅ Gráfica actualizada con nuevos datos");
      } else {
        console.error("❌ Error: No se pudo actualizar la gráfica, estructura incompleta");
      }
    });
  }
}