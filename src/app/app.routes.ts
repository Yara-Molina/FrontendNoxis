import { Routes } from '@angular/router';
import { LoginComponent } from './presenter/components/login/login.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: '**', redirectTo: 'login' }, // Redirige cualquier ruta desconocida al login (opcional)

];
