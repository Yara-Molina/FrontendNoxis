import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { DashboardCard, CardType } from '../../../domain/interfaces/dashboard.interface';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import {MatCardModule} from '@angular/material/card';
import { EnvironmentMonitoringComponent } from "../environment-monitoring/environment-monitoring.component";
import { FirePreventionComponent } from "../fire-prevention/fire-prevention.component";
import { GasMeasurementComponent } from "../gas-measurement/gas-measurement.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent,
    NotificationsComponent, EnvironmentMonitoringComponent, FirePreventionComponent, GasMeasurementComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dashboardData: DashboardCard[] = [
    { id: 1, title: 'Monitoreo del Ambiente', type: 'chart' as CardType },
    { id: 2, title: 'Prevención de Incendios', type: 'chart' as CardType },
    { id: 3, title: 'Gases Tóxicos', type: 'chart' as CardType },
    { id: 4, title: 'Notificaciones', type: 'notification' as CardType }
  ];  
}