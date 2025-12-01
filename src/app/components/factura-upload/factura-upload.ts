import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { PdfToExcelService } from '../../services/pdf-to-excel';

// Importar Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Factura {
  fileName: string;
  productos: any[];
}

@Component({
  selector: 'app-factura-upload',
  standalone: true,
  imports: [
    CommonModule,
    // Material UI
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
  allProducts: any[] = [];

  constructor(private pdfToExcel: PdfToExcelService) { }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf')) {
        console.log(`Detectado PDF: ${file.name}`);
        try {
          const blob = await this.pdfToExcel.pdfToExcel(file);
          const newFile = new File([blob], file.name.replace('.pdf', '.xlsx'));
          this.procesarFactura(newFile);
        } catch (err) {
          console.error('Error al convertir PDF:', err);
          alert('La conversión automática a Excel aún no está disponible. Puedes convertirlo manualmente a .xlsx para procesarlo.');
        }
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        this.procesarFactura(file);
      } else {
        console.warn(`Tipo de archivo no soportado: ${file.name}`);
      }
    });
  }

  procesarFactura(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const startIndex = jsonData.findIndex(
          (row: any) =>
            row &&
            row.some((cell: any) =>
              cell?.toString().toLowerCase().includes('descripción')
            )
        );

        if (startIndex === -1) {
          console.warn(`No se encontró encabezado de productos en ${file.name}`);
          return;
        }

        const detailRows = jsonData.slice(startIndex + 1);

        const cleanRows = detailRows.filter(
          (row: any) =>
            row &&
            row.length >= 8 &&
            typeof row[0] === 'number' &&
            !row.join(' ').toLowerCase().includes('total')
        );

        const productos = cleanRows.map((row: any) => ({
          n: row[0],
          codigo: row[1],
          descripcion: row[2],
          unidad: row[4],
          cantidad: row[5]
        }));

        this.facturas.push({
          fileName: file.name,
          productos
        });

        console.log(`Factura procesada: ${file.name}`, productos);

      } catch (err) {
        console.error('Error leyendo factura:', err);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  guardarFacturas(): void {
    const merged = this.facturas.flatMap((f) => f.productos);

    this.allProducts = merged.map((p, index) => ({
      ...p,
      n: index + 1
    }));

    localStorage.setItem('productosFactura', JSON.stringify(this.allProducts));
    alert(`Se guardaron ${this.allProducts.length} productos de ${this.facturas.length} facturas.`);
  }

  limpiarTodo(): void {
    if (confirm('¿Seguro que deseas limpiar todas las facturas cargadas?')) {
      this.facturas = [];
      this.allProducts = [];
    }
  }

  eliminarFactura(index: number): void {
    const confirmado = confirm('¿Seguro que deseas eliminar esta factura?');

    if (!confirmado) return;

    this.facturas.splice(index, 1);
  }
}
