
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private chartData: number[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket('wss://tu-servidor-websocket.com');

    this.socket.onopen = () => {
      console.log("✅ Conectado al WebSocket");
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (!message || !message.data || typeof message.data.data !== 'number') {
          console.warn("⚠ Mensaje recibido pero sin datos útiles:", message);
          return;
        }

        const sensorValue = message.data.data;
        console.log("📡 Datos procesados para actualizar la gráfica:", sensorValue);

        this.updateChartData(sensorValue);

      } catch (error) {
        console.error("🚨 Error procesando el mensaje del WebSocket:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("❌ Error en WebSocket:", error);
    };

    this.socket.onclose = () => {
      console.warn("🔌 WebSocket cerrado, reconectando en 5 segundos...");
      setTimeout(() => this.connect(), 5000);
    };
  }

  private updateChartData(value: number) {
    if (typeof value !== 'number') {
      console.error("🚨 Error: Valor inválido para la gráfica:", value);
      return;
    }

    this.chartData.push(value);

    // Limita la cantidad de datos en la gráfica para evitar que crezca demasiado
    if (this.chartData.length > 10) {
      this.chartData.shift();
    }

    console.log("📊 Datos de la gráfica actualizados:", this.chartData);
  }

  public getChartData() {
    return this.chartData;
  }
}