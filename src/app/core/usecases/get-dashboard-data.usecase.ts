import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDashboardRepository } from '../../data/repositories/dashboard.repository';
import { DashboardCard } from '../../domain/interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class GetDashboardDataUseCase {
  constructor(private repository: IDashboardRepository) {}

  execute(): Observable<DashboardCard[]> {
    return this.repository.getDashboardData();
  }
}