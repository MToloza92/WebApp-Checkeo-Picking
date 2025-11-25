import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte';


@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist.html',
  styleUrls: ['./checklist.scss']
})
export class Checklist {

  products: any[] = [];
  filter: string = '';
  mostrarHistorial: boolean = false;
  historial: any[] = [];

  // Variables para el modal "Guardar como"
  mostrarModalGuardar: boolean = false;
  formatoSeleccionado: 'pdf' | 'excel' = 'pdf';
  nombreArchivo: string = 'reporte-checklist';

  constructor(private reporteService: ReporteService) { }



  ngOnInit(): void {
    const saved = localStorage.getItem('productosFactura');
    if (saved) {
      const rawProducts = JSON.parse(saved);

      const mergedMap = new Map<string, any>();

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

    } else {
      alert('⚠️ No hay productos cargados. Sube primero una factura.');
    }
  }

  filtrarProductos(): any[] {
    const texto = this.filter.toLowerCase();
    return this.products.filter(
      (p) =>
        p.descripcion.toString().toLowerCase().includes(texto) ||
        p.codigo.toString().toLowerCase().includes(texto)
    );
  }

  actualizarCantidad(p: any): void {
    const cantidadNum = Number(p.cantidad);
    const verificadaNum = Number(p.cantidadVerificada);

    if (verificadaNum < 0) {
      p.cantidadVerificada = 0;
    }

    if (verificadaNum === 0) {
      p.estado = 'pendiente';
    } else if (verificadaNum < cantidadNum) {
      p.estado = 'parcial';
    } else if (verificadaNum === cantidadNum) {
      p.estado = 'completo';
    } else if (verificadaNum > cantidadNum) {
      p.estado = 'excedido';
    }
  }

  limpiarChecklist(): void {
    if (confirm('¿Deseas reiniciar todas las cantidades?')) {
      this.products.forEach((p) => {
        p.cantidadVerificada = 0;
        p.estado = 'pendiente';
      });
    }
  }

  getProgreso(): number {
    const total = this.products.length;
    const completos = this.products.filter((p) => p.estado === 'completo').length;
    return total ? Math.round((completos / total) * 100) : 0;
  }

  // -------------------------------
  // Modal "Guardar como"
  // -------------------------------
  abrirModalGuardar(): void {
    this.mostrarModalGuardar = true;
  }

  cerrarModalGuardar(): void {
    this.mostrarModalGuardar = false;
  }

  confirmarGuardado(): void {
    this.mostrarModalGuardar = false;

    this.reporteService.generarReporte(
      this.products,
      this.nombreArchivo || 'reporte-checklist',
      this.formatoSeleccionado
    );
  }

  cargarHistorial() {
    this.historial = this.reporteService.obtenerHistorial();
  }

  abrirHistorial() {
    this.historial = this.reporteService.obtenerHistorial();
    this.mostrarHistorial = true;
  }

  cerrarHistorial() {
    this.mostrarHistorial = false;
  }

  descargarHistorialItem(item: any) {
    this.reporteService.descargarDesdeHistorial(item, this.products);
  }

  borrarHistorial() {
    if (confirm('¿Seguro que deseas borrar todo el historial?')) {
      this.reporteService.limpiarHistorial();
      this.cargarHistorial();
    }
  }

}
