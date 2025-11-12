import { Routes } from '@angular/router';
import { FacturaUpload } from './components/factura-upload/factura-upload';
import { Checklist } from './components/checklist/checklist';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: 'upload', component: FacturaUpload },
  { path: 'checklist', component: Checklist },
];
