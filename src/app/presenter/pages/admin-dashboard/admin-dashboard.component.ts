import { Component, OnInit } from '@angular/core';
import { AdminCardComponent } from '../../components/admin-card/admin-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { KitService } from '../../../service/kit.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateKitDialogComponent } from '../../components/create-kit-dialog/create-kit-dialog.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, AdminCardComponent, SearchBarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  allKits: any[] = [];
  kits: any[] = [];
  totalKits: number = 0;
  activeKits: number = 0;
  inactiveKits: number = 0;
  constructor(private kitService: KitService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadAllKits();
  }

  loadAllKits(): void {
    this.kitService.getAllKits().subscribe({
      next: (data) => {
        this.allKits = data.map((kit: any) => ({
          clave: kit.clave,
          cliente: kit.username,
          activacion: "No disponible",
          sensores: kit.sensores || [],
          estado: kit.status ? "Activo" : "Inactivo"
        }));

        this.kits = [...this.allKits];
        this.updateKitCounts();
        console.log("Kits depurados:", this.kits);
      },
      error: (err) => console.error("Error cargando kits:", err),
    });
  }


  applyFilter(filterType: string): void {
    if (filterType === "activos") {
      this.kits = this.allKits.filter(kit => kit.estado === "Activo");
    } else if (filterType === "inactivos") {
      this.kits = this.allKits.filter(kit => kit.estado === "Inactivo");
    } else {
      this.kits = [...this.allKits];
    }

    console.log(`Filtrando por: ${filterType}`, this.kits);
  }


  applySearch(searchText: string): void {
    if (!searchText) {
      this.kits = [...this.allKits];
    } else {
      this.kits = this.allKits.filter(kit => 
        kit.clave.toLowerCase().includes(searchText.toLowerCase()) ||
        kit.cliente.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    console.log(`Buscando por: ${searchText}`, this.kits);
  }
  private updateKitCounts(): void {
    this.totalKits = this.allKits.length;
    this.activeKits = this.allKits.filter(kit => kit.estado === "Activo").length;
    this.inactiveKits = this.allKits.filter(kit => kit.estado === "Inactivo").length;
  }
  openCreateKitDialog(): void {
    const dialogRef = this.dialog.open(CreateKitDialogComponent, {
      width: '400px',
      data: { sensors: [] } // Puedes pasar información adicional al diálogo si es necesario
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Nuevo kit creado:', result);
      }
    });
  }
}
