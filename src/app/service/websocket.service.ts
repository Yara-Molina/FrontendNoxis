import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private messages$: Subject<{ sensor: string, value: number }> = new Subject();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8081/ws');

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messages$.next(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => console.error('WebSocket error:', error);
    this.socket.onclose = () => console.warn('WebSocket closed');
  }

  getMessages(): Observable<{ sensor: string, value: number }> {
    return this.messages$.asObservable();
  }
}
