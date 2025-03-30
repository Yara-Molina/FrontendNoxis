import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Notification } from '../../../domain/interfaces/notification.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule,
    MatCardModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  title: string = 'Notificaciones';
  notifications: Notification[] = [
    { id: 1, type: 'low', message: 'Nivel bajo de gas detectado.', timestamp: new Date() },
    { id: 2, type: 'medium', message: 'Nivel medio de gas detectado.', timestamp: new Date() },
    { id: 3, type: 'high', message: '¡Nivel alto de gas detectado! Precaución.', timestamp: new Date() },
    { id: 4, type: 'high', message: '¡Flama detectada! Actúe inmediatamente.', timestamp: new Date() }
  ];

  getNotificationsByType(type: 'low' | 'medium' | 'high'): Notification[] {
    return this.notifications.filter(notification => notification.type === type);
  }

  


}
