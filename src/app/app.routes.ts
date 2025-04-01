import { Routes } from '@angular/router';
import { LoginComponent } from './presenter/components/login/login.component';
import { DashboardComponent } from './presenter/components/dashboard/dashboard.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
      path: 'dashboard', 
      component: DashboardComponent,
    },
    
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login por defecto
    { path: '**', redirectTo: 'login' } // Ruta comodín para cualquier ruta inexistente
  ];