import { Component } from '@angular/core';

import { RouterModule, RouterOutlet } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './presenter/components/layout/header/header.component';
import { FooterComponent } from './presenter/components/layout/footer/footer.component';
import { DashboardComponent } from './presenter/components/dashboard/dashboard.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'project';
}
