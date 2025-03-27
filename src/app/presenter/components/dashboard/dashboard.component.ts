import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { DashboardCard, CardType } from '../../../domain/interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent],
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