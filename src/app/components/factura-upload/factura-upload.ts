import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PdfReaderService } from '../../services/pdf-reader';
import { StorageService } from '../../services/storage';
import { DialogService } from '../../services/dialog';
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
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './factura-upload.html',
  styleUrls: ['./factura-upload.scss']
})
export class FacturaUpload {

  // 🔥 USAR MatTableDataSource en lugar de array simple
  dataSource = new MatTableDataSource<Factura>([]);
  allProducts: Producto[] = [];

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['n', 'nombre', 'productos', 'acciones'];

  constructor(
    private pdfReader: PdfReaderService,
    private storage: StorageService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  // ============================================================
  // SUBIR ARCHIVOS - PROCESAMIENTO SECUENCIAL
  // ============================================================
  async onFilesSelected(event: any): Promise<void> {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    console.log(`📂 Archivos seleccionados: ${files.length}`);

    // Procesar archivos secuencialmente (uno por uno)
    for (const file of Array.from(files)) {
      const name = file.name.toLowerCase();

      try {
        if (name.endsWith('.pdf')) {
          console.log(`📄 Procesando PDF: ${file.name}`);
          await this.procesarPDF(file);
        } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
          console.log(`📊 Procesando Excel: ${file.name}`);
          await this.procesarExcel(file);
        } else {
          alert(`Formato no soportado: "${file.name}"`);
        }
      } catch (err) {
        console.error(`❌ Error procesando ${file.name}:`, err);
        alert(`Error al procesar ${file.name}`);
      }
    }

    // Limpiar input
    event.target.value = '';

    console.log(`✅ Total facturas cargadas: ${this.dataSource.data.length}`);
  }

  // ============================================================
  // PROCESAR PDF
  // ============================================================
  async procesarPDF(file: File): Promise<void> {
    try {
      const productosPDF = await this.pdfReader.extraerProductos(file);

      const productosNormalizados = productosPDF.map((p, index) => ({
        ...p,
        id: Date.now() + Math.random() * 1000 + index,
        codigo: this.normalizarCodigo(p.codigo),
        cantidadVerificada: p.cantidadVerificada || 0,
        estado: p.estado || 'pendiente' as const
      }));

      if (productosNormalizados.length === 0) {
        this.dialogService.confirm({
          title: 'Sin productos detectados',
          message: `No se pudieron detectar productos en: ${file.name}`,
          confirmText: 'Entendido',
          cancelText: ''
        }).subscribe();
        return;
      }

      //  Agregar al dataSource correctamente
      const facturasActuales = this.dataSource.data;
      facturasActuales.push({
        fileName: file.name,
        productos: productosNormalizados
      });
      this.dataSource.data = [...facturasActuales]; // 🔥 Forzar actualización

      console.log(`✅ PDF procesado: ${productosNormalizados.length} productos`);

    } catch (err) {
      console.error('Error procesando PDF:', err);
      throw err;
    }
  }

  // ============================================================
  // PROCESAR EXCEL - CONVERTIDO A PROMISE
  // ============================================================
  procesarExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Buscar encabezados
          const startIndex = jsonData.findIndex(
            (row: any) =>
              row?.some((cell: any) =>
                cell?.toString().toLowerCase().includes('descripción') ||
                cell?.toString().toLowerCase().includes('descripcion')
              )
          );

          if (startIndex === -1) {
            this.dialogService.confirm({
              title: 'Formato inválido',
              message: `No se encontraron encabezados válidos en: ${file.name}`,
              confirmText: 'Entendido',
              cancelText: ''
            }).subscribe();
            reject(new Error('No headers'));
            return;
          }

          const detailRows = jsonData.slice(startIndex + 1);

          // Limpiar filas inválidas
          const cleanRows = detailRows.filter(
            (row: any) =>
              row &&
              Array.isArray(row) &&
              row.length >= 6 &&
              (typeof row[0] === 'number' || !isNaN(Number(row[0]))) &&
              row[1] && // código
              row[2] && // descripción
              !row.join(' ').toLowerCase().includes('total') &&
              !row.join(' ').toLowerCase().includes('subtotal')
          );

          if (cleanRows.length === 0) {
            this.dialogService.confirm({
              title: 'Sin productos',
              message: `No se encontraron productos válidos en: ${file.name}`,
              confirmText: 'Entendido',
              cancelText: ''
            }).subscribe();
            reject(new Error('No products'));
            return;
          }

          // Crear productos
          const productosExcel: Producto[] = cleanRows.map((row: any, index: number) => ({
            id: Date.now() + Math.random() * 1000 + index,
            n: Number(row[0]) || (index + 1),
            codigo: this.normalizarCodigo(row[1]),
            descripcion: String(row[2]).trim(),
            unidad: String(row[4] || 'UN').trim(),
            cantidad: Number(row[5]) || 0,
            cantidadVerificada: 0,
            estado: 'pendiente' as const
          }));

          //  Agregar al dataSource correctamente
          const facturasActuales = this.dataSource.data;
          facturasActuales.push({
            fileName: file.name,
            productos: productosExcel
          });
          this.dataSource.data = [...facturasActuales]; //  Forzar actualización

          console.log(`✅ Excel procesado: ${productosExcel.length} productos`);
          resolve();

        } catch (err) {
          console.error('Error leyendo Excel:', err);
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error('FileReader error'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // ============================================================
  // GUARDAR AL STORAGE Y CONSOLIDAR DUPLICADOS
  // ============================================================
  guardarFacturas(): void {
    if (this.dataSource.data.length === 0) {
      this.dialogService.confirm({
        title: 'Sin facturas',
        message: 'No hay facturas para guardar.',
        confirmText: 'Entendido',
        cancelText: ''
      }).subscribe();
      return;
    }

    // Unir todos los productos
    const merged = this.dataSource.data.flatMap(f => f.productos);
    console.log(`📦 Productos totales antes de consolidar: ${merged.length}`);

    // Consolidar por código normalizado
    const mapa = new Map<string, Producto>();

    for (const p of merged) {
      const codigoNorm = this.normalizarCodigo(p.codigo);
      const key = codigoNorm;

      if (mapa.has(key)) {
        // Sumar cantidades de productos duplicados
        const existente = mapa.get(key)!;
        existente.cantidad += p.cantidad;
      } else {
        // Agregar nuevo producto
        mapa.set(key, {
          ...p,
          codigo: codigoNorm
        });
      }
    }

    // Convertir a array y renumerar
    this.allProducts = Array.from(mapa.values()).map((p, index) => ({
      ...p,
      id: Date.now() + index,
      n: index + 1
    }));

    // Guardar en storage
    this.storage.saveProducts(this.allProducts);

    const totalFacturas = this.dataSource.data.length;
    const productosOriginales = merged.length;
    const productosConsolidados = this.allProducts.length;

    console.log('✅ Productos guardados:', this.allProducts);

    // Mostrar diálogo de éxito
    this.dialogService.success({
      title: '✅ Guardado exitoso',
      message: 'Los productos han sido procesados y guardados correctamente.',
      details: [
        `${totalFacturas} factura(s) procesada(s)`,
        `${productosOriginales} productos detectados`,
        `${productosConsolidados} productos únicos consolidados`
      ]
    }).subscribe(() => {
      // Navegar al checklist después de cerrar el diálogo
      this.router.navigate(['/checklist']);
    });
  }

  // ============================================================
  // LIMPIAR TODO
  // ============================================================
  limpiarTodo(): void {
    if (this.dataSource.data.length === 0) return;

    this.dialogService.confirm({
      title: '¿Limpiar facturas?',
      message: 'Se eliminarán todas las facturas cargadas. Esta acción no se puede deshacer.',
      confirmText: 'Limpiar',
      cancelText: 'Cancelar'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.dataSource.data = [];
        this.allProducts = [];
      }
    });
  }

  // ============================================================
  // ELIMINAR FACTURA INDIVIDUAL
  // ============================================================
  eliminarFactura(index: number): void {
    const facturas = this.dataSource.data;

    this.dialogService.confirm({
      title: '¿Eliminar factura?',
      message: `Se eliminará "${facturas[index].fileName}" de la lista.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(confirmed => {
      if (confirmed) {
        facturas.splice(index, 1);
        this.dataSource.data = [...facturas];
        console.log(`🗑️ Factura eliminada. Total: ${this.dataSource.data.length}`);
      }
    });
  }

  // ============================================================
  // NORMALIZAR CÓDIGO (Evita duplicados por formato)
  // ============================================================
  private normalizarCodigo(codigo: any): string {
    return String(codigo)
      .trim()
      .replace(/\s+/g, '')        // Quita espacios internos
      .replace(/[^\w\-]/g, '')    // Quita caracteres raros excepto guiones
      .toUpperCase();             // Uniformidad
  }
}
