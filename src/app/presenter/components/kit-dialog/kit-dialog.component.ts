import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KitService } from '../../../service/kit.service';

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
    MatDialogActions,
    MatProgressSpinnerModule
  ],
  templateUrl: './kit-dialog.component.html',
  styleUrls: ['./kit-dialog.component.scss']
})
export class KitCodeDialogComponent {
  kitCode: string = '';
  loading = false;
  resultMessage = '';
  error = false;

  constructor(
    public dialogRef: MatDialogRef<KitCodeDialogComponent>,
    private kitService: KitService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.kitCode) return;

    const userId = 1;

    this.loading = true;
    this.resultMessage = '';
    this.error = false;

    this.kitService.redeemKit(userId, this.kitCode).subscribe({
      next: (res: { message: string }) => {
        this.resultMessage = '✅ ' + res.message;
        this.error = false;
        this.loading = false;
      },
      error: (err) => {
        this.resultMessage = `❌ Error: ${err.error?.error || 'No se pudo canjear el kit.'}`;
        this.error = true;
        this.loading = false;
      }
    });
  }
}
