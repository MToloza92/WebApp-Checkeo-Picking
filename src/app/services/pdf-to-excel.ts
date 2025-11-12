import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.mjs'; // ✅ usa el build normal, no el worker

// 👇 Configuramos el worker para cargarlo desde CDN (sin importar local)
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;

@Injectable({
  providedIn: 'root'
})
export class PdfToExcelService {
  async pdfToExcel(file: File): Promise<Blob> {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // 🧩 Abrimos el PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let allText: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        allText.push(pageText);
      }

      const fullText = allText.join('\n');
      console.log('📘 Texto extraído del PDF:', fullText.slice(0, 300));

      // Si no se encontró texto, mostramos un aviso
      if (!fullText.trim()) {
        throw new Error('El PDF no contiene texto seleccionable.');
      }

      // 🔎 Buscamos patrones básicos de productos
      const productRegex = /(\d+)\s+([A-Z0-9\s\-\/\.]+)\s+(UN|CJ|PAQ|ROL|BOT|KG)\s+(\d+)/g;
      const matches = [...fullText.matchAll(productRegex)];

      if (matches.length === 0) {
        throw new Error('No se encontraron líneas de producto válidas.');
      }

      const rows = matches.map((m, i) => ({
        n: i + 1,
        codigo: m[1],
        descripcion: m[2].trim(),
        unidad: m[3],
        cantidad: parseInt(m[4], 10)
      }));

      console.log('✅ Productos extraídos:', rows);

      // 📄 Creamos el Excel temporal
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Factura');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      return new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    } catch (err) {
      console.error('❌ Error durante la conversión del PDF:', err);
      throw new Error('conversion-error');
    }
  }
}
