import { Observable } from 'rxjs';
import { DashboardCard } from '../../domain/interfaces/dashboard.interface';

export interface IDashboardRepository {
  getDashboardData(): Observable<DashboardCard[]>;
}