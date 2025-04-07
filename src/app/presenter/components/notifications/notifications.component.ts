import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../../service/websocket.service';
import { SensorMessage } from '../../../domain/interfaces/notification.interface';
import { UserService } from '../../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-monitor',
  template: ``
})
export class NotificationsComponent implements OnInit {
  constructor(
    private wsService: WebSocketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.wsService.getMessages().subscribe((message: SensorMessage) => {
      // Verificamos si el usuario está autenticado
      if (this.userService.isAuthenticated()) {
        // Obtenemos el token y verificamos si es admin
        const token = this.userService.getToken();
        if (token) {
          try {
            // Decodificar el payload del token JWT
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userEmail = payload.email || payload.sub; // Dependiendo de cómo estén estructurados tus tokens
            
            // Si es un email de administrador, no mostramos la alerta
            if (userEmail && userEmail.includes('@admin')) {
              return; // No mostramos alertas a administradores
            }
            
            // Si no es administrador, continúa con la lógica para mostrar la alerta
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
              html: `Lecturas peligrosas detectadas:<br>${dataValues}`,
              confirmButtonText: 'Entendido',
              timer: 7000
            });
          } catch (error) {
            console.error('Error al decodificar el token JWT:', error);
          }
        }
      }
    });
  }
}