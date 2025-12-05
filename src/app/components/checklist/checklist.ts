import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ReporteService } from '../../services/reporte';
import { StorageService } from '../../services/storage';
import { ModalGuardar } from '../modal-guardar/modal-guardar';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './checklist.html',
  styleUrls: ['./checklist.scss']
})
export class Checklist {

  /** Tabla Material */
  dataSource = new MatTableDataSource<Producto>([]);

  /** Columnas visibles */
  displayedColumns: string[] = [
    'n',
    'codigo',
    'descripcion',
    'cantidad',
    'verificada',
    'estado',
  ];

  /** Productos cargados desde LocalStorage */
  products: Producto[] = [];

  /** Filtro del buscador */
  filter: string = '';

  constructor(
    private reporteService: ReporteService,
    private storage: StorageService,
    private dialog: MatDialog
  ) {}

  // ---------------------------------------------------------
  // Cargar productos desde LocalStorage (versión StorageService)
  // ---------------------------------------------------------
  ngOnInit(): void {

    // Se obtienen los productos desde el StorageService
    const storedProducts = this.storage.getProducts();

    if (!storedProducts || storedProducts.length === 0) {
      alert('No hay productos cargados. Sube primero una factura.');
      return;
    }

    console.log('Productos cargados:', storedProducts);

    // Asignamos al arreglo principal
    this.products = storedProducts;

    // Cargar en tabla Material
    this.dataSource.data = [...this.products];

    // Filtro en todas las columnas
    this.dataSource.filterPredicate = (data, filtro) => {
      const t = filtro.trim().toLowerCase();
      return (
        data.codigo.toLowerCase().includes(t) ||
        data.descripcion.toLowerCase().includes(t)
      );
    };
  }

  // ---------------------------------------------------------
  // Aplicar filtro a la tabla
  // ---------------------------------------------------------
  aplicarFiltro(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  // ---------------------------------------------------------
  // Actualización del estado del producto
  // ---------------------------------------------------------
  actualizarCantidad(p: Producto): void {
    const cantidad = Number(p.cantidad);
    const verificada = Number(p.cantidadVerificada);

    if (verificada <= 0) {
      p.estado = 'pendiente';
      p.cantidadVerificada = 0;
      return;
    }

    if (verificada < cantidad) {
      p.estado = 'parcial';
      return;
    }

    if (verificada === cantidad) {
      p.estado = 'completo';
      return;
    }

    if (verificada > cantidad) {
      p.estado = 'excedido';
      return;
    }
  }

  // ---------------------------------------------------------
  // Limpiar valores del checklist
  // ---------------------------------------------------------
  limpiarChecklist(): void {
    if (!confirm('¿Reiniciar todas las cantidades?')) return;

    this.products.forEach((p) => {
      p.cantidadVerificada = 0;
      p.estado = 'pendiente';
    });

    this.dataSource.data = [...this.products];
  }

  // ---------------------------------------------------------
  // Progreso general
  // ---------------------------------------------------------
  getProgreso(): number {
    const total = this.products.length;
    const completos = this.products.filter(p => p.estado === 'completo').length;
    return total ? Math.round((completos / total) * 100) : 0;
  }

  // ---------------------------------------------------------
  // Modal para guardar PDF/Excel
  // ---------------------------------------------------------
  abrirModalGuardar(): void {
    const dialogRef = this.dialog.open(ModalGuardar, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const { nombreArchivo, formato } = result;

      this.reporteService.generarReporte(
        this.products,
        nombreArchivo || 'reporte-checklist',
        formato
      );
    });
  }
}
