import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kit-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule,
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './kit-dialog.component.html',
  styleUrls: ['./kit-dialog.component.scss']
})
export class KitCodeDialogComponent {
  kitCode: string = '';
  
  constructor(public dialogRef: MatDialogRef<KitCodeDialogComponent>) {}
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  onSubmit(): void {
    this.dialogRef.close(this.kitCode);
  }
}