export interface ReporteHistorial {
  nombre: string;            // nombre del archivo generado
  tipo: 'pdf' | 'excel';     // formato del reporte
  fecha: string;             // fecha de creación
}
