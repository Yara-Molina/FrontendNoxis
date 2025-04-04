import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EnvironmentMonitoringComponent } from '../../components/environment-monitoring/environment-monitoring.component';
import { FirePreventionComponent } from '../../components/fire-prevention/fire-prevention.component';
import { GasMeasurementComponent } from '../../components/gas-measurement/gas-measurement.component';
import { CardComponent } from '../../components/card/card.component';

interface DashboardCard {
  id: number;
  title: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    EnvironmentMonitoringComponent, 
    FirePreventionComponent, 
    GasMeasurementComponent
  ],
  template: `
    <section class="dashboard-container" *ngIf="isBrowser">
      @for (card of dashboardData; track card.id) {
        <app-card [title]="card.title">
          @if (card.title === 'Monitoreo del Ambiente') {
            <app-environment-monitoring></app-environment-monitoring>
          }
          @if (card.title === 'Prevención de Incendios') {
            <app-fire-prevention></app-fire-prevention>
          }
          @if (card.title === 'Gases Tóxicos') {
            <app-gas-measurement></app-gas-measurement>
          }
        </app-card>
      }
    </section>
  `,
  styles: [`
    .dashboard-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  
  
  dashboardData: DashboardCard[] = [];
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.dashboardData = [
      { id: 1, title: 'Monitoreo del Ambiente', type: 'chart' },
      { id: 2, title: 'Prevención de Incendios', type: 'chart' },
      { id: 3, title: 'Gases Tóxicos', type: 'chart' }
    ];
  }
}