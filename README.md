📦 WebApp Checkeo Picking

Aplicación web desarrollada en Angular para digitalizar y controlar el proceso de checkeo (picking) de productos, permitiendo cargar facturas desde PDF o Excel, convertirlas en un checklist interactivo y generar reportes en PDF o Excel, con historial local.

🎯 Objetivo del Proyecto

Optimizar y digitalizar el proceso de verificación de productos (picking), reduciendo errores humanos, tiempos de revisión y permitiendo trazabilidad mediante reportes exportables.

El proyecto está pensado para funcionar sin backend, utilizando almacenamiento local del navegador.

🧩 Funcionalidades Principales
📥 Carga de documentos

Carga múltiple de archivos:

PDF (facturas)

Excel (.xls, .xlsx)

Extracción automática de productos:

Código

Descripción

Unidad

Cantidad

🧠 Unificación inteligente

Los productos con el mismo código se agrupan.

Las cantidades se suman automáticamente, incluso si provienen de distintos documentos (PDF + Excel).

✅ Checklist interactivo

Tabla dinámica con Angular Material.

Ingreso de cantidad verificada por producto.

Estados automáticos:

pendiente

parcial

completo

excedido

Barra de progreso general del picking.

Buscador por código o descripción.

📄 Generación de reportes

Exportación a:

PDF

Excel

El reporte refleja el estado real del checklist (cantidades verificadas y estado).

🕘 Historial de reportes

Registro local de reportes generados.

Cada registro guarda:

Nombre

Tipo

Fecha

Snapshot de los productos en ese momento

Descarga posterior del reporte sin perder el estado original.

Eliminación individual o total del historial.

💾 Persistencia de datos

Uso de LocalStorage:

Productos cargados

Historial de reportes

No depende de servidor.

Persistencia por navegador y dispositivo.

🏗️ Arquitectura del Proyecto
src/
├── index.html
├── main.ts
├── styles.scss
├── app/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.html
│   ├── app.scss
│   ├── app.ts
│   │
│   ├── components/
│   │   ├── checklist/          # Checklist principal
│   │   ├── factura-upload/     # Carga de PDF / Excel
│   │   ├── historial/           # Historial de reportes
│   │   ├── modal-guardar/       # Modal para exportar reportes
│   │   └── navbar/              # Barra de navegación
│   │
│   ├── services/
│   │   ├── pdf-reader.ts        # Lectura y parsing de PDF (pdf.js)
│   │   ├── pdf-to-excel.ts      # Generación de reportes
│   │   ├── storage.ts           # Manejo de LocalStorage
│   │   ├── reporte.ts           # Lógica de reportes + historial
│   │   └── dialog.ts            # Wrapper de MatDialog
│   │
│   ├── models/
│   │   └── producto.ts          # Modelo Producto
│   │
│   ├── interfaces/
│   │   ├── factura.ts
│   │   └── reporte-historial.ts
│   │
│   ├── layout/
│   │   └── main-layout.ts
│   │
│   └── types/
│       ├── pdfjs-dist.d.ts
│       └── pdfjs-worker.d.ts
│
└── assets/
    └── logo/
        └── logo-image.png

📐 Modelo de Datos Principal
Producto
export interface Producto {
  id: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  cantidadVerificada: number;
  estado: 'pendiente' | 'parcial' | 'completo' | 'excedido';
}

ReporteHistorial
export interface ReporteHistorial {
  nombre: string;
  tipo: 'pdf' | 'excel';
  fecha: string;
  productos: Producto[];
}


Cada reporte guarda una copia del estado del checklist, asegurando consistencia histórica.

📄 Lectura de PDF (pdf.js)

Se utiliza pdfjs-dist

El worker se ejecuta en segundo plano para:

Parsear texto

Evitar bloquear la UI

Se extrae la sección Detalle de las facturas

Se utiliza regex para detectar filas de productos

⚙️ Instalación y Uso
🔧 Instalar dependencias
npm install

▶ Ejecutar en desarrollo
ng serve -o


Abrir en:

http://localhost:4200

📦 Build de producción
ng build --configuration production


Salida:

dist/check-picking/browser/

🌐 Deploy en Vercel

Configuración recomendada:

Parámetro	Valor
Framework	Angular
Build Command	ng build --configuration production
Output Directory	dist/check-picking/browser
Install Command	npm install

Asegurar assets en angular.json:

"assets": [
  "src/assets",
  "src/favicon.ico"
]

⚠️ Consideraciones Importantes

LocalStorage:

Es por dispositivo + navegador

Se borra si el usuario limpia datos del navegador

Cambios en el código NO borran datos, salvo cambio de dominio.

Vercel no guarda datos del usuario, solo sirve la app.

🧪 Mejoras Futuras

Modo oscuro.

Miniaturas de reportes en historial.

Mejor parser de PDF con layouts variables.

Migrar almacenamiento a IndexedDB para grandes volúmenes.

Exportar checklist con firmas o validación final.

📚 Tecnologías Usadas

Angular (standalone components)

Angular Material

TypeScript

pdfjs-dist

xlsx

LocalStorage API

🧠 Estado del Proyecto

✅ Funcional
✅ Estable
✅ Apto para evaluación académica
🔧 En mejora continua

# Ejecutar el proyecto
ng serve
