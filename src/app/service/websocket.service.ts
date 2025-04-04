import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SensorMessage } from '../domain/interfaces/notification.interface';

const isBrowser = typeof window !== 'undefined';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messages$: Subject<SensorMessage> = new Subject();

  constructor() {
    if (isBrowser) {
      this.socket = new WebSocket('ws://backnoxis.upprojects.online:8081/ws');

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
  }

  getMessages(): Observable<SensorMessage> {
    return this.messages$.asObservable();
  }
}