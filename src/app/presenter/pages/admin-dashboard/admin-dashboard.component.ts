import { Component } from '@angular/core';
import { AdminCardComponent } from '../../components/admin-card/admin-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { Input } from '@angular/core';



@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgFor, NgClass, NgIf,AdminCardComponent,SearchBarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent {

  @Input() kits: any[] = [];

  totalKits: number = 0;
  activeKits: number = 0;
  inactiveKits: number = 0;

  applySearch(searchText: string) {
    console.log('Buscando:', searchText);
  }

  applyFilter(filterType: string) {
    console.log('Filtrando:', filterType);
  }
}

