import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregar módulos necesarios
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchText: string = '';
  filterType: string = 'todos';

  @Output() search = new EventEmitter<string>();
  @Output() filter = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchText);
  }

  setFilter(type: string) {
    this.filterType = type;
    this.filter.emit(type);
  }
}
