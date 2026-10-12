# Monety

Monety es una aplicación web sencilla, en español, para registrar ingresos y gastos y administrar presupuestos mensuales.

## Cómo usarla

Sirve la carpeta con cualquier servidor estático y abre la dirección local en un navegador moderno. Por ejemplo, con Python ejecuta `python -m http.server 8000` desde esta carpeta y visita `http://localhost:8000`. No requiere instalación de dependencias ni cuenta. Los movimientos y presupuestos se guardan en el almacenamiento local del navegador en el dispositivo actual.

- **Resumen:** consulta ingresos, gastos, balance disponible, tasa de ahorro y gastos por categoría.
- **Transacciones:** crea, edita, elimina, busca y filtra movimientos por mes, tipo y categoría.
- **Presupuestos:** asigna límites por categoría y revisa cuánto has utilizado.

La primera visita muestra datos de ejemplo que puedes cambiar o eliminar. Monety no se conecta a bancos; los datos no salen de este navegador ni se sincronizan entre dispositivos. La disponibilidad del almacenamiento depende del navegador; si no permite guardar, la app avisa y revierte el cambio.

## Desarrollo

Construida con HTML, CSS y JavaScript nativos, sin dependencias ni proceso de compilación.