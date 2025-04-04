import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private connected = false;
  private connectionSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<any>(null);

  constructor() {}

  connect(sensorName: string): Observable<boolean> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn(`⚠ WebSocket ya conectado a: ${sensorName}`);
      return this.connectionSubject.asObservable();
    }

    const wsUrl = `ws://localhost:8081/ws/${sensorName}`;
    console.log(`🔌 Intentando conectar a: ${wsUrl}`);
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log(`✅ WebSocket conectado: ${sensorName}`);
      this.connected = true;
      this.connectionSubject.next(true);
    };

    this.socket.onclose = (event) => {
      console.warn('⚠ WebSocket cerrado:', event);
      this.connected = false;
      this.connectionSubject.next(false);
      this.reconnect(sensorName);
    };

    this.socket.onerror = (event) => {
      console.error('❌ WebSocket error:', event);
      this.connected = false;
      this.connectionSubject.next(false);
    };

    this.socket.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        console.log("📡 Mensaje crudo recibido:", rawData);
    
        if (!rawData || typeof rawData !== 'object') {
          console.warn("⚠ Mensaje recibido inválido o vacío:", rawData);
          return;
        }
    
        let processedData: any = {};
    
        if (rawData.name === "MQ135") {
          processedData["Calidad Aire MQ-135"] = rawData.data; // Asigna el valor directamente
        } else if (rawData.name === "BME680" && rawData.data) {
          processedData["Temperatura"] = rawData.data.temperature;
          processedData["Humedad"] = rawData.data.humidity;
          processedData["Presion"] = rawData.data.pressure;
        }
    
        console.log("📡 Datos procesados para actualizar la gráfica:", processedData);
    
        if (Object.keys(processedData).length > 0) {
          this.messageSubject.next(processedData);
        } else {
          console.warn("⚠ Mensaje recibido pero sin datos útiles:", rawData);
        }
      } catch (error) {
        console.error('❌ Error al parsear mensaje:', error);
      }
    };
        
    return this.connectionSubject.asObservable();
  }

  private reconnect(sensorName: string): void {
    console.log("🔄 Intentando reconectar en 5 segundos...");
    setTimeout(() => this.connect(sensorName), 5000);
  }

  disconnect(): void {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      console.log("🚪 Cerrando conexión WebSocket...");
      this.socket.close();
    }
    this.socket = null;
    this.connected = false;
    this.connectionSubject.next(false);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }
}