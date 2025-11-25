import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private HISTORY_KEY = 'historialReportes';

  // -------------------------------------------------------------
  // HISTORIAL
  // -------------------------------------------------------------
  guardarHistorial(nombre: string, tipo: string) {
    const historial = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');

    historial.push({
      nombre,
      tipo,
      fecha: new Date().toLocaleString()
    });

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(historial));
  }

  obtenerHistorial() {
    return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
  }

  limpiarHistorial() {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  // Descarga desde el historial
  descargarDesdeHistorial(item: any, products: any[]) {
    if (item.tipo === 'pdf') {
      this.generarPDF(products, item.nombre);
    } else {
      this.generarExcel(products, item.nombre);
    }
  }

  // -------------------------------------------------------------
  // GENERAR REPORTE (PDF o EXCEL)
  // -------------------------------------------------------------
  generarReporte(products: any[], nombreArchivo: string, tipo: 'pdf' | 'excel'): void {
    if (tipo === 'pdf') {
      this.generarPDF(products, nombreArchivo);
    } else {
      this.generarExcel(products, nombreArchivo);
    }

    this.guardarHistorial(nombreArchivo, tipo);
  }

  // -------------------------------------------------------------
  // EXCEL REAL
  // -------------------------------------------------------------
  private generarExcel(products: any[], nombreArchivo: string): void {
    const hoja = XLSX.utils.json_to_sheet(products);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, 'Checklist');

    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
  }

  // -------------------------------------------------------------
  // PDF REAL CON TABLA
  // -------------------------------------------------------------
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
