import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PdfReaderService } from '../../services/pdf-reader';
import { StorageService } from '../../services/storage';
import { Producto } from '../../models/producto';

interface Factura {
  fileName: string;
  productos: Producto[];
}

@Component({
  selector: 'app-factura-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './factura-upload.html',
  styleUrls: ['./factura-upload.scss']
})
export class FacturaUpload {

  facturas: Factura[] = [];
  allProducts: Producto[] = [];

  constructor(
    private pdfReader: PdfReaderService,
    private storage: StorageService
  ) {}

  // ============================================================
  //     CUANDO SE SUBEN ARCHIVOS (PDF o Excel)
  // ============================================================
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      const name = file.name.toLowerCase();

      if (name.endsWith('.pdf')) {
        await this.procesarPDF(file);
        return;
      }

      if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        this.procesarExcel(file);
        return;
      }
    });
  }

  // ============================================================
  //     PROCESAR PDF
  // ============================================================
  async procesarPDF(file: File) {
    try {
      const productos = await this.pdfReader.extraerProductos(file);

      if (productos.length === 0) {
        alert('No se pudieron detectar productos en el PDF.');
        return;
      }

      this.facturas.push({
        fileName: file.name,
        productos
      });

    } catch (err) {
      console.error('Error procesando PDF:', err);
      alert('Ocurrió un error al leer el PDF.');
    }
  }

  // ============================================================
  //     PROCESAR EXCEL
  // ============================================================
  procesarExcel(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const startIndex = jsonData.findIndex(
          (row: any) =>
            row?.some((cell: any) =>
              cell?.toString().toLowerCase().includes('descripción')
            )
        );

        if (startIndex === -1) return;

        const detailRows = jsonData.slice(startIndex + 1);

        const cleanRows = detailRows.filter(
          (row: any) =>
            row &&
            typeof row[0] === 'number' &&
            row.length >= 6 &&
            !row.join(' ').toLowerCase().includes('total')
        );

        let idCounter = Date.now();
        const productos: Producto[] = cleanRows.map((row: any) => ({
          id: idCounter++,
          codigo: row[1],
          descripcion: row[2],
          unidad: row[4],
          cantidad: Number(row[5]),
          cantidadVerificada: 0,
          estado: 'pendiente'
        }));

        this.facturas.push({
          fileName: file.name,
          productos
        });

      } catch (err) {
        console.error('Error leyendo Excel:', err);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // ============================================================
  //     GUARDAR AL STORAGE
  // ============================================================
  guardarFacturas(): void {
    const merged = this.facturas.flatMap(f => f.productos);

    this.allProducts = merged.map((p, i) => ({
      ...p,
      // numeración visual, no forma parte del modelo
      index: i + 1
    }));

    this.storage.saveProducts(this.allProducts);
    alert(`Se guardaron ${this.allProducts.length} productos.`);
  }

  limpiarTodo(): void {
    if (!confirm('¿Seguro que deseas limpiar todas las facturas?')) return;
    this.facturas = [];
    this.allProducts = [];
  }

  eliminarFactura(index: number): void {
    if (!confirm('¿Eliminar esta factura?')) return;
    this.facturas.splice(index, 1);
  }
}
