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
import { ModalGuardar } from '../modal-guardar/modal-guardar';

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

  // Material Table datasource ✔
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'n',
    'codigo',
    'descripcion',
    'cantidad',
    'verificada',
    'estado',
  ];

  products: any[] = [];

  // Búsqueda
  filter: string = '';

  constructor(
    private reporteService: ReporteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('productosFactura');
    if (!saved) {
      alert('⚠️ No hay productos cargados. Sube primero una factura.');
      return;
    }

    const rawProducts = JSON.parse(saved);
    const mergedMap = new Map<string, any>();

    // Combinar productos con mismo código y descripción
    rawProducts.forEach((p: any) => {
      const key = `${p.codigo}-${p.descripcion}`.toLowerCase();

      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        existing.cantidad += Number(p.cantidad);
      } else {
        mergedMap.set(key, {
          ...p,
          cantidad: Number(p.cantidad),
          cantidadVerificada: 0,
          estado: 'pendiente'
        });
      }
    });

    this.products = Array.from(mergedMap.values()).map((p, i) => ({
      ...p,
      n: i + 1
    }));

    // Cargar en el datasource ✔
    this.dataSource.data = this.products;

    // Activar filtro global para todas las columnas
    this.dataSource.filterPredicate = (data, filtro) => {
      const t = filtro.trim().toLowerCase();
      return (
        data.codigo.toString().toLowerCase().includes(t) ||
        data.descripcion.toString().toLowerCase().includes(t)
      );
    };
  }

  // ✔ Filtro de Angular Material
  aplicarFiltro(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  // Actualizar estado del producto
  actualizarCantidad(p: any): void {
    const cantidadNum = Number(p.cantidad);
    const verificadaNum = Number(p.cantidadVerificada);

    if (verificadaNum < 0) p.cantidadVerificada = 0;

    if (verificadaNum === 0) p.estado = 'pendiente';
    else if (verificadaNum < cantidadNum) p.estado = 'parcial';
    else if (verificadaNum === cantidadNum) p.estado = 'completo';
    else p.estado = 'excedido';
  }

  // Limpiar checklist
  limpiarChecklist(): void {
    if (!confirm('¿Deseas reiniciar todas las cantidades?')) return;

    this.products.forEach((p) => {
      p.cantidadVerificada = 0;
      p.estado = 'pendiente';
    });

    // Actualizar tabla
    this.dataSource.data = [...this.products];
  }

  // Progreso
  getProgreso(): number {
    const total = this.products.length;
    const completos = this.products.filter((p) => p.estado === 'completo').length;
    return total ? Math.round((completos / total) * 100) : 0;
  }

  // Abrir modal guardar
  abrirModalGuardar(): void {
    const dialogRef = this.dialog.open(ModalGuardar, { width: '400px' });

    dialogRef.afterClosed().subscribe(resultado => {
      if (!resultado) return;

      const { nombreArchivo, formato } = resultado;

      this.reporteService.generarReporte(
        this.products,
        nombreArchivo || 'reporte-checklist',
        formato
      );
    });
  }
}
