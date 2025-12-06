export interface Producto {
  id: number;  // identificador único interno (equivale a n)
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;

  cantidadVerificada: number;
  estado: 'pendiente' | 'parcial' | 'completo' | 'excedido';
}
