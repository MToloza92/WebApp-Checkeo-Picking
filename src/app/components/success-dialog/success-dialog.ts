import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface SuccessDialogData {
  title: string;
  message: string;
  details?: string[];
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="success-dialog">
      <div class="dialog-icon">
        <mat-icon color="primary">check_circle</mat-icon>
      </div>

      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content>
        <p class="message">{{ data.message }}</p>

        <div *ngIf="data.details && data.details.length > 0" class="details">
          <div *ngFor="let detail of data.details" class="detail-item">
            <mat-icon>done</mat-icon>
            <span>{{ detail }}</span>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="center">
        <button mat-flat-button color="primary" (click)="onClose()">
          Entendido
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .success-dialog {
      padding: 8px;
    }

    .dialog-icon {
      text-align: center;
      margin-bottom: 16px;

      mat-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
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
      padding: 0 24px 24px;

      .message {
        text-align: center;
        color: rgba(0, 0, 0, 0.7);
        font-size: 16px;
        margin: 0 0 20px 0;
      }

      .details {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 16px;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;

          mat-icon {
            color: #388e3c;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          span {
            color: rgba(0, 0, 0, 0.87);
            font-size: 14px;
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 16px;
      border-top: 1px solid #e0e0e0;

      button {
        min-width: 140px;
      }
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
