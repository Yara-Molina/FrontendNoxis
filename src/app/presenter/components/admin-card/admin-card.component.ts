import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-admin-card',
  standalone: true,
  imports: [],
  templateUrl: './admin-card.component.html',
  styleUrl: './admin-card.component.scss'
})
export class AdminCardComponent {
  @Input() totalKits: number = 0;
  @Input() activeKits: number = 0;
  @Input() inactiveKits: number = 0;
}
