import { Producto } from "../models/producto";

export interface Factura {
  fileName: string;
  productos: Producto[];
}
