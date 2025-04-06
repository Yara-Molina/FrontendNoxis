import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../../service/websocket.service';
import { SensorMessage } from '../../../domain/interfaces/notification.interface';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-monitor',
  template: ``
})
export class NotificationsComponent implements OnInit {
  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.getMessages().subscribe((message: SensorMessage) => {
      const { name, data } = message;

      const formatData = (data: any): string => {
        if (typeof data === 'object' && !Array.isArray(data)) {
          return Object.entries(data)
            .map(([key, value]) => `${key}: ${formatData(value)}`)
            .join('<br>');
        } else {
          return data;
        }
      };

      const dataValues = formatData(data);

      Swal.fire({
        icon: 'warning',
        title: `⚠️ Alerta del sensor ${name}`,
        html: `Lecturas peligrosas detectadas:<br>${dataValues}`, // Mostrar datos con formato estético
        confirmButtonText: 'Entendido',
        timer: 7000
      });
    });
  }
}
