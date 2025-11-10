# 🧾 WebApp Checkeo Picking

Aplicación web desarrollada en **Angular 20** que permite **cargar facturas (Excel o PDF)** y generar un **checklist interactivo** para verificar productos durante el proceso de recepción de pedidos en una librería.  
Fue diseñada para reemplazar el proceso manual de verificación con papel y lápiz, mejorando la eficiencia y reduciendo errores humanos.

---

## 🚀 Características principales

- 📂 Carga de múltiples facturas en formato **.xlsx** o **.pdf**
- ⚙️ Conversión automática de PDF a Excel (experimental, local)
- 🧮 Generación de **checklist de productos combinados**
- 🟡 Verificación por cantidad: cada producto cambia de color (pendiente, en progreso, verificado)
- 💾 Almacenamiento local con **LocalStorage** (sin backend)
- 📱 Diseño adaptable (Tablet / Android mediante PWA)

---

## 🧠 Tecnologías utilizadas

- **Angular 20**
- **TypeScript**
- **XLSX (SheetJS)**
- **PDF.js (pdfjs-dist)**
- **LocalStorage API**

---

## 🧰 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/MToloza92/webapp-checkeo-picking.git
cd webapp-checkeo-picking

# Instalar dependencias
npm install

# Ejecutar el proyecto
ng serve
