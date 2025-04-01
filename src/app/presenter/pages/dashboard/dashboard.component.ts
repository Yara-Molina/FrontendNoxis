import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { DashboardCard, CardType } from '../../../domain/interfaces/dashboard.interface';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent,
    NotificationsComponent,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dashboardData: DashboardCard[] = [
    { id: 1, title: 'Medicion del ambiente', type: 'chart' as CardType },
    { id: 2, title: 'Prevencion de incendios', type: 'chart' as CardType },
    { id: 3, title: 'Gases toxicos', type: 'chart' as CardType },
    { id: 4, title: 'Notificaciones', type: 'notification' as CardType }
  ];
}