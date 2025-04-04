import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { KitService } from '../../../service/kit.service';

@Component({
  standalone: true,
  selector: 'app-create-kit-dialog',
  templateUrl: './create-kit-dialog.component.html',
  styleUrls: ['./create-kit-dialog.component.scss'],
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ]
})
export class CreateKitDialogComponent {
  newKit = {
    username: '',
    sensoresInput: ''
  };

  constructor(
    private kitService: KitService,
    public dialogRef: MatDialogRef<CreateKitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    const sensoresArray = this.newKit.sensoresInput
      .split(',')
      .map(sensor => sensor.trim())
      .filter(sensor => sensor.length > 0);

    const kitToCreate = {
      username: this.newKit.username,
      sensores: sensoresArray
    };

    this.kitService.createKit(kitToCreate).subscribe({
      next: (response) => {
        console.log('Kit creado exitosamente:', response);
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Error al crear el kit:', err);
        alert('Ocurrió un error al crear el kit. Por favor, inténtalo de nuevo.');
      }
    });

    console.log('Nuevo kit a enviar al backend:', kitToCreate);
  }
}
