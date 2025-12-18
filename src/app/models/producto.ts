export interface Producto {
  id: number;           // identificador único interno
  n?: number;           // número correlativo visible en la tabla (opcional para PDFs)
  codigo: string;       // código del producto
  descripcion: string;  // descripción del producto
  unidad: string;       // unidad de medida (UN, CJ, PAQ, etc.)
  cantidad: number;     // cantidad solicitada en la factura

  // Campos de verificación
  cantidadVerificada: number;  // cantidad ingresada por el usuario
  estado: 'pendiente' | 'parcial' | 'completo' | 'excedido';  // estado actual
}
