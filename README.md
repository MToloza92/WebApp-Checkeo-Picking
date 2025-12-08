# 📦 Checkeo Picking — WebApp para Validación de Productos en Bodega

Aplicación web desarrollada en **Angular 17 (standalone components)** para cargar facturas, generar checklists y administrar un historial de reportes descargables en **PDF o Excel**.  
Funciona totalmente **offline**, usando LocalStorage, y está optimizada para uso en bodegas.

---

## 🌐 Deploy en Vercel

👉 <https://webapp-check-picking.vercel.app/>

---

## 🧭 Funcionalidades principales

### 📤 1. Carga de facturas (.xlsx / .pdf)

- Lee archivos Excel y detecta automáticamente las columnas de productos.
- Conversión experimental de PDF → Excel.
- Limpieza automática de filas.
- Obtención de:
- Número correlativo  
- Código  
- Descripción  
- Unidad  
- Cantidad solicitada  

---

### 📋 2. Checklist interactivo

- Consolida productos duplicados por código + descripción.
- Permite ingresar **cantidad verificada**.
- Determina automáticamente el estado:
- ✔ completo
- ▣ parcial
- ○ pendiente
- ✖ excedido
- Barra de progreso dinámico.
- Filtro global (código / descripción).

---

### 🗂 3. Historial de reportes

- Guarda cada reporte generado:
- nombre del archivo  
- tipo (PDF / Excel)  
- fecha  
- cantidad de productos  
- Permite:
- volver a descargar  
- borrar un registro  
- limpiar historial completo  
- Descarga usando **Angular + jsPDF + XLSX**.

---

### 🎨 4. Interfaz Material Design (Azure Blue)

- Diseño funcional para bodegas.
- Uso de componentes Angular Material:
- Toolbar, Buttons, Table, Icons, Menu, Dialogs.
- Navbar responsiva con logo propio:
- **“Check✔”** (archivo: `assets/logo/logo-image.png`).

---

## 🗂 Estructura del proyecto (actualizada)

src/
├── index.html
│   • Entrada principal de la app. Carga `<app-root>`.
│
├── main.ts
│   • Punto de arranque Angular (standalone).
│
├── styles.scss
│   • Estilos globales y paleta (Material Azure Blue).
│
├── app/
│   ├── app.routes.ts
│   │   • Rutas principales: /upload, /checklist, /historial.
│   │
│   ├── app.ts / app.html / app.scss
│   │   • Componente raíz. Contiene navbar + router-outlet.
│   │
│   ├── components/
│   │   ├── navbar/
│   │   │   • Barra superior con logo y botones. Totalmente responsive.
│   │   │
│   │   ├── factura-upload/
│   │   │   • Carga PDFs/Excel, los procesa y guarda productos.
│   │   │
│   │   ├── checklist/
│   │   │   • Vista principal de verificación: tabla, estados, progreso.
│   │   │
│   │   ├── historial/
│   │   │   • Muestra reportes generados + descarga PDF/Excel.
│   │   │
│   │   └── modal-guardar/
│   │       • Modal Material para guardar un reporte con nombre y formato.
│   │
│   ├── services/
│   │   ├── storage.ts
│   │   │   • Administra LocalStorage (productos + historial).
│   │   │
│   │   ├── reporte.ts
│   │   │   • Genera PDF/Excel y registra historial.
│   │   │
│   │   └── pdf-to-excel.ts
│   │       • Conversión experimental de PDF a Excel.
│   │
│   ├── models/ & interfaces/
│   │   • Tipos estrictos: Producto, Factura, Historial.
│   │
│   └── types/
│       • Tipos necesarios para trabajar con PDF.js.
│
└── assets/
    └── logo/
        • logo-image.png — Logo oficial del navbar.

---

## 🛠️ Instalación y Uso

Instalar Dependencias
Utiliza el comando npm install para preparar el entorno de desarrollo.

Ejecutar en Modo Desarrollo
El comando es ng serve -o. La aplicación se abrirá en <http://localhost:4200>.

## 📦 Build y Despliegue

Build de Producción
El comando de compilación es ng build --configuration production.

La salida de los archivos compilados se encuentra en dist/check-picking/browser/.

### Despliegue en Vercel

Framework: Angular

Build Command: ng build --configuration production

Output Directory: dist/check-picking/browser

Install Command: npm install

Asegúrate de incluir los assets (como el logo y favicon) en la configuración, por ejemplo: "assets": [ "src/assets", "src/favicon.ico" ].
