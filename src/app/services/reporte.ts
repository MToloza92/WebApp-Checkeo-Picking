import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReporteHistorial } from '../interfaces/reporte-historial';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  /**
   * Clave única del historial.
   * Versionada por si cambia la estructura en el futuro.
   */
  private HISTORY_KEY = 'checkPicking_historial_v1';

  // ======================================================
  //   HISTORIAL: GUARDAR / OBTENER / LIMPIAR
  // ======================================================

  /**
   * Agrega un reporte al historial (PDF o Excel).
   */
  guardarHistorial(nombre: string, tipo: 'pdf' | 'excel'): void {
    const historial: ReporteHistorial[] =
      JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');

    historial.push({
      nombre,
      tipo,
      fecha: new Date().toLocaleString()
    });

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(historial));
  }

  /**
   * Obtiene el historial completo.
   */
  obtenerHistorial(): ReporteHistorial[] {
    return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
  }

  /**
   * Reemplaza totalmente el historial.
   * (Usado al borrar elementos).
   */
  guardarHistorialArray(lista: ReporteHistorial[]): void {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(lista));
  }

  /**
   * Elimina todo el historial.
   */
  limpiarHistorial(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  // ======================================================
  //      DESCARGAR DESDE HISTORIAL
  // ======================================================

  /**
   * Regenera un archivo PDF o Excel desde el historial.
   */
  descargarDesdeHistorial(item: ReporteHistorial, products: any[], formato: 'pdf' | 'excel') {
    if (formato === 'pdf') {
      this.generarPDF(products, item.nombre);
    } else {
    this.generarExcel(products, item.nombre);
    }
  }

  // ======================================================
  //      GENERAR REPORTE MANUAL (usado en checklist)
  // ======================================================

  /**
   * Genera un reporte (PDF o Excel) y lo guarda en historial.
   */
  generarReporte(
    products: any[],
    nombreArchivo: string,
    tipo: 'pdf' | 'excel'
  ): void {

    if (tipo === 'pdf') {
      this.generarPDF(products, nombreArchivo);
    } else {
      this.generarExcel(products, nombreArchivo);
    }

    this.guardarHistorial(nombreArchivo, tipo);
  }

  // ======================================================
  //      GENERAR ARCHIVO EXCEL
  // ======================================================

  private generarExcel(products: any[], nombreArchivo: string): void {
    const hoja = XLSX.utils.json_to_sheet(products);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, 'Checklist');
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
  }

  // ======================================================
  //      GENERAR ARCHIVO PDF
  // ======================================================

  private generarPDF(products: any[], nombreArchivo: string): void {
    const doc = new jsPDF();

    doc.text('Reporte de Checklist', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['#', 'Código', 'Descripción', 'U.Med', 'Cant.', 'Verificada', 'Estado']],
      body: products.map(p => [
        p.n,
        p.codigo,
        p.descripcion,
        p.unidad,
        p.cantidad,
        p.cantidadVerificada,
        p.estado
      ])
    });

    doc.save(`${nombreArchivo}.pdf`);
  }
}
