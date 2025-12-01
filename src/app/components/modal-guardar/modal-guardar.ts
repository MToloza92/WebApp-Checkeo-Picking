import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-guardar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './modal-guardar.html',
  styleUrls: ['./modal-guardar.scss']
})
export class ModalGuardar {

  nombreArchivo: string = 'reporte-checklist';
  formato: 'pdf' | 'excel' = 'pdf';

  constructor(
    private dialogRef: MatDialogRef<ModalGuardar>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (!this.nombreArchivo.trim()) return;

    this.dialogRef.close({
      nombreArchivo: this.nombreArchivo.trim(),
      formato: this.formato
    });
  }
}
