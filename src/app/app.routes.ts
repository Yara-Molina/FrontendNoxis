import { Routes } from '@angular/router';
import { LoginComponent } from './presenter/pages/login/login.component';
import { DashboardComponent } from './presenter/pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './presenter/pages/admin-dashboard/admin-dashboard.component';
import { SingUpComponent } from './presenter/pages/sing-up/sing-up.component';

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
    
    { path: '', redirectTo: 'signup', pathMatch: 'full' },
    { path: '**', redirectTo: 'signup' }, 
    { path: 'signup', component: SingUpComponent },
  ];