import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { StorageService } from '../../services/storage';
import { ReporteService } from '../../services/reporte';
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

  /** Columnas visibles en la tabla Material */
  displayedColumns = ['nombre', 'tipo', 'fecha', 'acciones'];

  /** Lista de reportes almacenados */
  historial: ReporteHistorial[] = [];

  /** Productos existentes en localStorage */
  productos: any[] = [];

  constructor(
    private storage: StorageService,
    private reporteService: ReporteService
  ) {}

  ngOnInit() {
    // Cargar historial almacenado
    this.historial = this.reporteService.obtenerHistorial();

    // Cargar productos que permiten regenerar reportes
    this.productos = this.storage.getProducts();

    console.log('Historial cargado', this.historial);
    console.log('Productos cargados', this.productos);
  }

  /** Recargar historial desde el servicio */
  cargarHistorial(): void {
    this.historial = this.reporteService.obtenerHistorial();
  }

  /**
   * Descargar un reporte desde el historial usando un formato
   * seleccionado desde el menú desplegable.
   */
  descargar(item: ReporteHistorial, formato: 'pdf' | 'excel'): void {

    // Asegurar que existen productos
    const productos = this.storage.getProducts();

    if (!productos || productos.length === 0) {
      alert('No hay productos guardados para generar este reporte.');
      return;
    }

    this.reporteService.descargarDesdeHistorial(item, productos, formato);
  }

  /** Eliminar un registro del historial */
  borrar(item: ReporteHistorial): void {
    if (!confirm('¿Eliminar este registro del historial?')) return;

    const nuevoHistorial = this.historial.filter(h => h.fecha !== item.fecha);
    this.reporteService.guardarHistorialArray(nuevoHistorial);

    this.cargarHistorial();
  }

  /** Limpiar todo el historial */
  limpiarTodo(): void {
    if (!confirm('¿Limpiar completamente el historial?')) return;

    this.reporteService.limpiarHistorial();
    this.cargarHistorial();
  }
}
