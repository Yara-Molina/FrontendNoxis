import { Routes } from '@angular/router';
import { LoginComponent } from './presenter/pages/login/login.component';
import { DashboardComponent } from './presenter/pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './presenter/pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
      path: 'dashboard', 
      component: DashboardComponent,
    },
    {
      path: 'admin-dashboard',
      component:AdminDashboardComponent,
    },
    
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login por defecto
    { path: '**', redirectTo: 'login' } // Ruta comodín para cualquier ruta inexistente
  ];