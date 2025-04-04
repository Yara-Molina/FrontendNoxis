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

      const dataValues = Object.entries(data)
        .map(([k, v]) => `${k}: ${v}`)
        .join('<br>');

      Swal.fire({
        icon: 'warning',
        title: `⚠️ Alerta del sensor ${name}`,
        html: `Lecturas peligrosas detectadas:<br>${dataValues}`,
        confirmButtonText: 'Entendido',
        timer: 7000
      });
    });
  }
}
