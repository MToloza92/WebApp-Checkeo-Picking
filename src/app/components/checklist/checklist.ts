import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { ReporteService } from '../../services/reporte';
import { StorageService } from '../../services/storage';
import { DialogService } from '../../services/dialog';
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
    MatCardModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './checklist.html',
  styleUrls: ['./checklist.scss']
})
export class Checklist {

  dataSource = new MatTableDataSource<Producto>([]);

  displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'cantidad',
    'verificada',
    'estado',
  ];

  products: Producto[] = [];

  constructor(
    private reporteService: ReporteService,
    private storage: StorageService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  // ---------------------------------------------------------
  // Cargar productos
  // ---------------------------------------------------------
  ngOnInit(): void {
    const storedProducts = this.storage.getProducts();

    if (!storedProducts || storedProducts.length === 0) {
      this.dialogService.confirm({
        title: 'Sin productos',
        message: 'No hay productos cargados. Sube primero una factura.',
        confirmText: 'Entendido',
        cancelText: ''
      }).subscribe();
      return;
    }

    this.products = storedProducts;
    this.dataSource.data = [...this.products];

    // Filtro estable (NO rompe tabla)
    this.dataSource.filterPredicate = (data, filtro) => {
      const f = filtro.trim().toUpperCase();
      return (
        data.codigo.toUpperCase().includes(f) ||
        data.descripcion.toUpperCase().includes(f)
      );
    };
  }

  // ---------------------------------------------------------
  // Filtro buscador
  // ---------------------------------------------------------
  aplicarFiltro(event: any) {
    this.dataSource.filter = event.target.value.trim().toUpperCase();
  }

  // ---------------------------------------------------------
  // Actualizar estado
  // ---------------------------------------------------------
  actualizarCantidad(p: Producto): void {
    const cantidad = Number(p.cantidad);
    const verificada = Number(p.cantidadVerificada);

    if (verificada <= 0) {
      p.estado = 'pendiente';
      p.cantidadVerificada = 0;
    } else if (verificada < cantidad) {
      p.estado = 'parcial';
    } else if (verificada === cantidad) {
      p.estado = 'completo';
    } else {
      p.estado = 'excedido';
    }
  }

  // ---------------------------------------------------------
  // Limpiar checklist (Dialog Material)
  // ---------------------------------------------------------
  limpiarChecklist(): void {
    this.dialogService.confirm({
      title: '¿Reiniciar checklist?',
      message: 'Se reiniciarán todas las cantidades verificadas.',
      confirmText: 'Reiniciar',
      cancelText: 'Cancelar'
    }).subscribe(confirmado => {
      if (!confirmado) return;

      this.products.forEach(p => {
        p.cantidadVerificada = 0;
        p.estado = 'pendiente';
      });

      this.dataSource.data = [...this.products];
    });
  }

  // ---------------------------------------------------------
  // Progreso
  // ---------------------------------------------------------
  getProgreso(): number {
    const total = this.products.length;
    const completos = this.products.filter(p => p.estado === 'completo').length;
    return total ? Math.round((completos / total) * 100) : 0;
  }

  // ---------------------------------------------------------
  // Modal guardar reporte
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
