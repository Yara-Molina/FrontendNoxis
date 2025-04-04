import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './presenter/components/layout/header/header.component';
import { FooterComponent } from './presenter/components/layout/footer/footer.component';
import { NotificationsComponent } from './presenter/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'project';
}
