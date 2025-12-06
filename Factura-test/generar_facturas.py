import pandas as pd

# Datos para las 3 facturas nuevas usando SOLO productos del original
facturas = [
    {
        'folio': 125702,
        'fecha': '2025-03-11 00:00:00',
        'productos': [
            [1, '12002142', 'BOLSA REGALO 210g 30X41.5X12cm', 0, 'UN', 25, 1072, 26800],
            [2, '12002137', 'BOLSA REGALO 210g 18X23X10cm', 0, 'UN', 40, 668, 26720],
            [3, '12002132', 'BOLSA REGALO 210g 26X32X10cm', 0, 'UN', 35, 905, 31675],
            [4, '5024096', 'COLA FRIA ESCOLAR 0250gr NO', 0, 'UN', 80, 561, 44880],
            [5, '5024095', 'COLA FRIA ESCOLAR 0125gr NO', 0, 'UN', 100, 308, 30800],
            [6, '5024097', 'COLA FRIA ESCOLAR 0500gr NO', 0, 'UN', 50, 1008, 50400],
            [7, '5024100', 'COLA FRIA ESCOLAR 0225gr NO', 0, 'UN', 80, 561, 44880],
            [8, '5024101', 'COLA FRIA ESCOLAR 0150gr NO', 0, 'UN', 100, 424, 42400],
            [9, '28007003', 'VASO PLASTICO 200cc 50 unid', 0, 'UN', 30, 893, 26790],
            [10, '2044207', 'LIBRO ASISTENCIA 050hj SIMP', 0, 'UN', 40, 1646, 65840]
        ]
    },
    {
        'folio': 125703,
        'fecha': '2025-03-12 00:00:00',
        'productos': [
            [1, '12002144', 'BOLSA REGALO 210g 26X32X10cm', 0, 'UN', 40, 905, 36200],
            [2, '12002127', 'BOLSA REGALO 210g 30X41.5X12cm', 0, 'UN', 30, 1072, 32160],
            [3, '12002156', 'BOLSA REGALO 210g 26X32X10cm', 0, 'UN', 25, 905, 22625],
            [4, '12002147', 'BOLSA REGALO 210g 26X32X10cm', 0, 'UN', 25, 905, 22625],
            [5, '12002133', 'BOLSA REGALO 210g 30X41.5X12cm', 0, 'UN', 20, 1072, 21440],
            [6, '12002126', 'BOLSA REGALO 210g 26X32X10cm', 0, 'UN', 25, 905, 22625],
            [7, '5024104', 'COLA FRIA MADERA 0225gr ARTEL', 0, 'UN', 40, 951, 38040],
            [8, '5074832', 'PAPEL CREPE ROSADO 0.5x2mt', 0, 'UN', 40, 160, 6400],
            [9, '5089083', 'TIJERA ESCOLAR ZIG-ZAG 13.5cm', 0, 'UN', 45, 1542, 69390],
            [10, '2012872', 'CARPETA PLASTICA OFICIO TIPO L', 0, 'UN', 35, 1901, 66535]
        ]
    },
    {
        'folio': 125704,
        'fecha': '2025-03-13 00:00:00',
        'productos': [
            [1, '11001135', 'PALITO PARA MAQUETA 02X20mm', 0, 'UN', 40, 494, 19760],
            [2, '5024096', 'COLA FRIA ESCOLAR 0250gr NO', 0, 'UN', 60, 561, 33660],
            [3, '5024095', 'COLA FRIA ESCOLAR 0125gr NO', 0, 'UN', 80, 308, 24640],
            [4, '5024097', 'COLA FRIA ESCOLAR 0500gr NO', 0, 'UN', 40, 1008, 40320],
            [5, '5024100', 'COLA FRIA ESCOLAR 0225gr NO', 0, 'UN', 70, 561, 39270],
            [6, '5024101', 'COLA FRIA ESCOLAR 0150gr NO', 0, 'UN', 90, 424, 38160],
            [7, '28007003', 'VASO PLASTICO 200cc 50 unid', 0, 'UN', 25, 893, 22325],
            [8, '2044207', 'LIBRO ASISTENCIA 050hj SIMP', 0, 'UN', 35, 1646, 57610],
            [9, '5089083', 'TIJERA ESCOLAR ZIG-ZAG 13.5cm', 0, 'UN', 40, 1542, 61680],
            [10, '2012872', 'CARPETA PLASTICA OFICIO TIPO L', 0, 'UN', 30, 1901, 57030]
        ]
    }
]

# Generar cada archivo Excel
for factura in facturas:
    df = pd.DataFrame(factura['productos'], columns=['Nº', 'Codigo', 'Descripción', 'Serie', 'U.Med', 'Cantidad', 'Precio', 'Total'])
    nombre_archivo = f'f{factura["folio"]}.xlsx'

    with pd.ExcelWriter(nombre_archivo, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Table 3', index=False, startrow=6)

    print(f'Archivo generado: {nombre_archivo}')

print("¡Todos los archivos han sido generados!")
