import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { Producto } from '../models/producto';

// ============================================================
// CONFIGURACIÓN: USAR FAKE WORKER (REQUIERE SOLO TEXTO)
// ============================================================
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = '';

@Injectable({ providedIn: 'root' })
export class PdfReaderService {

  constructor() {}

  // ============================================================
  // LECTURA DE PDF (Sin worker)
  // ============================================================
  async extraerProductos(file: File): Promise<Producto[]> {
    try {
      const buffer = await file.arrayBuffer();

      const pdf = await (pdfjsLib as any).getDocument({
        data: buffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: false
      }).promise;

      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items.map((t: any) => t.str).join(' ');
        text += '\n' + pageText;
      }

      text = text.replace(/\s+/g, ' ').trim();

      return this.parseDetalle(text);
    } catch (e) {
      console.error('Error leyendo PDF:', e);
      throw e;
    }
  }

  // ============================================================
  // PARSE DETALLE
  // ============================================================
  private parseDetalle(text: string): Producto[] {
    const productos: Producto[] = [];

    const ini = text.indexOf('Detalle');
    const fin = text.indexOf('SubTotal');

    if (ini === -1 || fin === -1) return [];

    const contenido = text.substring(ini, fin);

    const regex =
      /(\d+)\s+(\d{6,12})\s+(.+?)\s+(UN|NO|CJ|PA|KG|UNID)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)/g;

    let match;
    let id = Date.now();

    while ((match = regex.exec(contenido)) !== null) {
      productos.push({
        id: id++,
        codigo: match[2],
        descripcion: match[3].trim(),
        unidad: match[4],
        cantidad: this.toNumber(match[5]),
        cantidadVerificada: 0,
        estado: 'pendiente'
      });
    }

    return productos;
  }

  private toNumber(val: string): number {
    return Number(val.replace(/\./g, '').replace(',', '.'));
  }
}
