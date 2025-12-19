import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { StorageService } from '../../services/storage';
import { ReporteService } from '../../services/reporte';
import { DialogService } from '../../services/dialog';
import { ReporteHistorial } from '../../interfaces/reporte-historial';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss']
})
export class HistorialComponent implements OnInit {

  displayedColumns = ['nombre', 'tipo', 'fecha', 'acciones'];
  historial: ReporteHistorial[] = [];
  productos: any[] = [];

  constructor(
    private storage: StorageService,
    private reporteService: ReporteService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.cargarHistorial();
    this.productos = this.storage.getProducts();
  }

  cargarHistorial(): void {
    this.historial = this.reporteService.obtenerHistorial();
  }

  // ---------------------------------------------------------
  // Descargar reporte desde historial
  // ---------------------------------------------------------
  descargar(item: ReporteHistorial, formato: 'pdf' | 'excel'): void {
    const productos = this.storage.getProducts();

    if (!productos || productos.length === 0) {
      this.dialogService.confirm({
        title: 'Sin productos',
        message: 'No hay productos guardados para generar este reporte.',
        confirmText: 'Entendido',
        cancelText: ''
      }).subscribe();
      return;
    }

    this.reporteService.descargarDesdeHistorial(item, productos, formato);
  }

  // ---------------------------------------------------------
  // Eliminar un registro del historial
  // ---------------------------------------------------------
  borrar(item: ReporteHistorial): void {
    this.dialogService.confirm({
      title: 'Eliminar registro',
      message: `¿Deseas eliminar el reporte "${item.nombre}" del historial?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(confirmado => {
      if (!confirmado) return;

      const nuevoHistorial = this.historial.filter(h => h.fecha !== item.fecha);
      this.reporteService.guardarHistorialArray(nuevoHistorial);
      this.cargarHistorial();
    });
  }

  // ---------------------------------------------------------
  // Limpiar todo el historial
  // ---------------------------------------------------------
  limpiarTodo(): void {
    this.dialogService.confirm({
      title: 'Limpiar historial',
      message: 'Se eliminarán todos los reportes guardados. Esta acción no se puede deshacer.',
      confirmText: 'Limpiar',
      cancelText: 'Cancelar'
    }).subscribe(confirmado => {
      if (!confirmado) return;

      this.reporteService.limpiarHistorial();
      this.cargarHistorial();
    });
  }
}
