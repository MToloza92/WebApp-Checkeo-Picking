import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { ReporteHistorial } from '../interfaces/reporte-historial';

/**
 * Claves utilizadas en LocalStorage.
 * Se versionan para evitar conflictos si cambia la estructura.
 */
const STORAGE_PRODUCTS = 'checkPicking_products_v2';
const STORAGE_HISTORIAL = 'checkPicking_historial_v1';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // ===========================================================
  //               PRODUCTOS
  // ===========================================================

  /**
   * Guarda la lista completa de productos en LocalStorage.
   * Se envuelve en try/catch para evitar que un error rompa la aplicación.
   */
  saveProducts(products: Producto[]): void {
    try {
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
    } catch (err) {
      console.error('❌ Error guardando productos en LocalStorage:', err);
    }
  }

  /**
   * Obtiene y valida el listado de productos guardados.
   * Siempre retorna un arreglo seguro y evita fallas si el JSON está corrupto.
   */
  getProducts(): Producto[] {
    try {
      const raw = localStorage.getItem(STORAGE_PRODUCTS);
      if (!raw) return [];

      const parsed = JSON.parse(raw);

      // Validación mínima para evitar datos corruptos.
      if (!Array.isArray(parsed)) {
        console.warn('⚠ Datos de productos corruptos. Se limpiará el almacenamiento.');
        this.clearProducts();
        return [];
      }

      return parsed as Producto[];

    } catch (err) {
      console.error('❌ Error leyendo productos:', err);
      return [];
    }
  }

  /**
   * Limpia completamente la lista de productos.
   */
  clearProducts(): void {
    localStorage.removeItem(STORAGE_PRODUCTS);
  }

  /**
   * Actualiza un producto específico comparando su ID.
   * Si no se encuentra, muestra un warning.
   */
  updateProduct(p: Producto): void {
    const products = this.getProducts();
    const index = products.findIndex(pr => pr.id === p.id);

    if (index >= 0) {
      products[index] = p;
      this.saveProducts(products);
    } else {
      console.warn(`⚠ No se encontró el producto con id ${p.id} para actualizar.`);
    }
  }

  // ===========================================================
  //       HISTORIAL DE REPORTES (PDF / Excel generados)
  // ===========================================================

  /**
   * Guarda una entrada del historial de reportes.
   * Cada entrada se apila en un array guardado en LocalStorage.
   */
  saveHistorial(entry: ReporteHistorial): void {
    try {
      const historial = this.getHistorial();
      historial.push(entry);

      localStorage.setItem(STORAGE_HISTORIAL, JSON.stringify(historial));

    } catch (err) {
      console.error('❌ Error guardando historial:', err);
    }
  }

  /**
   * Devuelve la lista de reportes generados.
   * Valida la integridad del JSON para evitar fallos.
   */
  getHistorial(): ReporteHistorial[] {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORIAL);
      if (!raw) return [];

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        console.warn('⚠ Historial corrupto. Se limpiará.');
        this.clearHistorial();
        return [];
      }

      return parsed as ReporteHistorial[];

    } catch (err) {
      console.error('❌ Error obteniendo historial:', err);
      return [];
    }
  }

  /**
   * Elimina completamente el historial de reportes.
   */
  clearHistorial(): void {
    localStorage.removeItem(STORAGE_HISTORIAL);
  }

  saveHistorialArray(entries: ReporteHistorial[]): void {
  localStorage.setItem(STORAGE_HISTORIAL, JSON.stringify(entries));
}

}
