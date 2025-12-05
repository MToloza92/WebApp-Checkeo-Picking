import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PdfToExcelService } from '../../services/pdf-to-excel';
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
    private pdfToExcel: PdfToExcelService,
    private storage: StorageService
  ) {}

  // ------------------------------------------------------------
  // Cuando el usuario selecciona uno o más archivos
  // ------------------------------------------------------------
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      const name = file.name.toLowerCase();

      // Conversión automática PDF → Excel
      if (name.endsWith('.pdf')) {
        try {
          const blob = await this.pdfToExcel.pdfToExcel(file);
          const newFile = new File([blob], file.name.replace('.pdf', '.xlsx'));
          this.procesarFactura(newFile);
        } catch (err) {
          alert('Aún no se puede convertir PDF automáticamente.');
        }
        return;
      }

      // Excel directo
      if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        this.procesarFactura(file);
        return;
      }
    });
  }

  // ------------------------------------------------------------
  // Lee el Excel y extrae productos válidos
  // ------------------------------------------------------------
  procesarFactura(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Buscar fila donde están los encabezados
        const startIndex = jsonData.findIndex(
          (row: any) =>
            row &&
            row.some((cell: any) =>
              cell?.toString().toLowerCase().includes('descripción')
            )
        );

        if (startIndex === -1) return;

        // Obtener filas posteriores
        const detailRows = jsonData.slice(startIndex + 1);

        // Filtrar filas inválidas
        const cleanRows = detailRows.filter(
          (row: any) =>
            row &&
            typeof row[0] === 'number' &&
            row.length >= 6 &&
            !row.join(' ').toLowerCase().includes('total')
        );

        // Crear lista de productos con el modelo correcto
        const productos: Producto[] = cleanRows.map((row: any, index: number) => ({
          id: Date.now() + index, // ID único
          n: row[0],
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
        console.error('Error leyendo factura:', err);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // ------------------------------------------------------------
  // Guarda TODAS las facturas al StorageService oficial
  // ------------------------------------------------------------
  guardarFacturas(): void {
    const merged = this.facturas.flatMap(f => f.productos);

    // Normalizar numeración
    this.allProducts = merged.map((p, i) => ({
      ...p,
      n: i + 1
    }));

    // Guardar con StorageService (clave correcta v2)
    this.storage.saveProducts(this.allProducts);

    alert(`Se guardaron ${this.allProducts.length} productos.`);
  }

  // ------------------------------------------------------------
  // Limpia la vista (no localStorage)
  // ------------------------------------------------------------
  limpiarTodo(): void {
    if (!confirm('¿Seguro que deseas limpiar todas las facturas cargadas?'))
      return;

    this.facturas = [];
    this.allProducts = [];
  }

  eliminarFactura(index: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta factura?')) return;
    this.facturas.splice(index, 1);
  }
}
