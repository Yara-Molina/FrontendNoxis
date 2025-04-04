import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { KitCodeDialogComponent } from '../../kit-dialog/kit-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentRoute: string = '';
  
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }
  
  showButton(): boolean {
    return this.currentRoute.includes('/dashboard') && !this.currentRoute.includes('/admin-dashboard');
  }
  
  openKitCodeDialog(): void {
    const dialogRef = this.dialog.open(KitCodeDialogComponent, {
      width: '350px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí manejas el código del kit que se ingresó
        console.log('Código de kit ingresado:', result);
        // Puedes llamar a un servicio para procesar el código
      }
    });
  }
}