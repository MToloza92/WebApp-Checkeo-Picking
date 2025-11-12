import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {
  const saved = localStorage.getItem('productosFactura');
  if (saved) {
    const rawProducts = JSON.parse(saved);

    // Combinar productos duplicados (por código + descripción)
    const mergedMap = new Map<string, any>();

    rawProducts.forEach((p: any) => {
      const key = `${p.codigo}-${p.descripcion}`.toLowerCase();

      if (mergedMap.has(key)) {
        // Si ya existe el producto, sumar cantidad
        const existing = mergedMap.get(key);
        existing.cantidad += Number(p.cantidad);
      } else {
        // Si no existe, agregarlo con cantidad inicial
        mergedMap.set(key, {
          ...p,
          cantidad: Number(p.cantidad),
          cantidadVerificada: 0, // 🟡 Inicializamos verificación
          verificado: false
        });
      }
    });

    // Convertir el mapa en array
    this.products = Array.from(mergedMap.values()).map((p, i) => ({
      ...p,
      n: i + 1 // numeración final global
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

    if (verificadaNum < 0) p.cantidadVerificada = 0;

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
}
