import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-icon">
        <mat-icon color="warn">warning</mat-icon>
      </div>

      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText }}
        </button>
        <button mat-flat-button color="warn" (click)="onConfirm()">
          {{ data.confirmText }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 8px;
    }

    .dialog-icon {
      text-align: center;
      margin-bottom: 16px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    }

    h2 {
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #0d47a1;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      text-align: center;
      color: rgba(0, 0, 0, 0.7);
      font-size: 16px;
      padding: 0 16px 24px;

      p {
        margin: 0;
      }
    }

    mat-dialog-actions {
      padding: 16px;
      gap: 12px;
      border-top: 1px solid #e0e0e0;

      button {
        min-width: 100px;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
