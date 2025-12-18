import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog';
import { SuccessDialogComponent } from '../components/success-dialog/success-dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface SuccessDialogData {
  title: string;
  message: string;
  details?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  /**
   * Muestra un diálogo de confirmación
   */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        ...data,
        confirmText: data.confirmText || 'Confirmar',
        cancelText: data.cancelText || 'Cancelar'
      },
      disableClose: false,
      autoFocus: true
    });

    return dialogRef.afterClosed();
  }

  /**
   * Muestra un diálogo de éxito con detalles
   */
  success(data: SuccessDialogData): Observable<void> {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '450px',
      data,
      disableClose: false,
      autoFocus: true
    });

    return dialogRef.afterClosed();
  }
}
