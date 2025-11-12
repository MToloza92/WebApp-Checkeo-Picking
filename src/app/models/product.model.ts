// product.model.ts
export interface Product {
  id: number;           // index o n°
  codigo: string;       // código del producto
  descripcion: string;  // descripción
  umed?: string;        // unidad de medida
  cantidad: number;     // cantidad pedida
  checked?: boolean;    // si fue marcado como verificado
}
