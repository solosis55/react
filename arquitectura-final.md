# react

## arquitectura-final.md

Este proyecto migra decisiones de validacion al compilador de TypeScript para
reducir errores que en JavaScript puro aparecian en ejecucion. La idea central
es detectar inconsistencias antes de correr la app.

### 1) Genericos (`DataTable<T>`)

El componente `DataTable<T>` recibe `data: T[]` y `columns` tipadas con
`keyof T`. Esto evita columnas invalidas en tiempo de compilacion (por ejemplo,
intentar renderizar una clave que no existe en la entidad).

Beneficio frente a JavaScript:
- En JS, una key incorrecta devuelve `undefined` y rompe la UI en runtime.
- En TS, el error aparece al escribir el codigo, antes de ejecutar.

### 2) Tipos de utilidad (`Partial<T>`)

La edicion de filas usa un estado temporal `Partial<Person>`. Esto modela que,
mientras se edita, el formulario puede tener campos incompletos.

Beneficio frente a JavaScript:
- Evita asumir que todos los campos existen siempre.
- Obliga a manejar casos parciales en el guardado de datos.

### 3) Uniones discriminadas

Para estados de UI o de peticiones (por ejemplo: `idle | loading | success |
error`), una union discriminada permite definir transiciones explicitas y
seguras usando una propiedad discriminante (`status`).

Beneficio frente a JavaScript:
- Evita combinaciones imposibles de estado (por ejemplo, datos y error a la vez).
- Mejora la legibilidad porque cada caso tiene una forma de datos clara.

### 4) Tipo `never` para exhaustividad

Cuando se maneja una union discriminada con `switch`, el tipo `never` permite
forzar que todos los casos esten cubiertos. Si falta uno, TypeScript marca error.

Beneficio frente a JavaScript:
- Previene ramas no contempladas que en produccion terminan en errores silenciosos.

### 5) Utilidad de fechas con libreria externa y tipos estrictos

La funcion `getDaysDifference(startDate: Date, endDate: Date): number` usa
`date-fns` para calcular diferencias en dias, con entradas y salida estrictamente
tipadas.

Beneficio frente a JavaScript:
- Evita pasar strings o valores ambiguos sin control de tipos.
- Reduce errores de conversion de fechas en runtime.

### Conclusión

Con este enfoque, gran parte de los errores se detecta en compilacion
(`npx tsc --noEmit`) y no cuando el usuario ya esta usando la aplicacion.
El resultado es un codigo mas mantenible, con menos bugs de datos y menos
coste de depuracion en produccion.