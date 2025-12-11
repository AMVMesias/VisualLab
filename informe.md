# Universidad de las Fuerzas Armadas - ESPE

## PRUEBAS DE SOFTWARE

### INFORME

```
Autores
```
```
Mesias Mariscal, Denise Rea, Julio Viche
```
```
Sangolquí, 06 de Noviembre 2025
```

**Tema del Proyecto:** VisualLab 3D
**Objetivo General:**
● Realizar el levantamiento, análisis y validación de los requisitos funcionales y no
funcionales del proyecto VisualLab 3D, integrando las aplicaciones Interactive 3D
Viewer y FractalLab bajo una arquitectura Features, y efectuar pruebas de calidad de
código con SonarQube para garantizar la mantenibilidad, seguridad y cumplimiento
de estándares técnicos previos a la fase de desarrollo.

**Objetivos específicos:
●** Identificar y documentar los requisitos funcionales y no funcionales del sistema,
estableciendo criterios de aceptación claros y priorizados según las necesidades del
proyecto.
**●** Diseñar la estructura preliminar de la base de datos y la especificación de la API
REST, considerando la integración entre los módulos Interactive 3D Viewer y
FractalLab.
**●** Configurar y ejecutar el análisis estático de código mediante SonarQube, con el fin de
evaluar la calidad, seguridad y mantenibilidad del proyecto.
**●** Analizar los resultados obtenidos en SonarQube y proponer mejoras para optimizar el
cumplimiento de estándares de calidad y buenas prácticas de desarrollo
**Desarrollo:**
En el estado actual, el proyecto se compone de dos aplicaciones cliente independientes
(Interactive3DViewer y FractalLab) que funcionan como front-end puro para visualización
3D y fractales, sin back-end, autenticación, persistencia ni pruebas automatizadas; se ha
documentado y definido el alcance para la integración en la plataforma VisualLab 3D
(incluyendo requisitos funcionales y no funcionales, priorizados y con criterios de
aceptación), y se ha adoptado la Arquitectura Features como guía de diseño; las tareas
pendientes y prioridades inmediatas son diseñar el esquema de la base de datos, especificar la
API REST (OpenAPI/Swagger), implementar autenticación y CRUD de proyectos, y
desplegar un entorno de prueba seguro (HTTPS) para comenzar las pruebas de seguridad y la
integración de ambos módulos.

Para integrar Interactive 3D Viewer y FractalLab en una única aplicación web (VisualLab
3D) que permita visualización y edición de fractales y escenas 3D, con autenticación de
usuarios, persistencia en base de datos para guardar/cargar proyectos y configuraciones por
usuario, registro de historial de actividades, sistema de notificaciones y una API backend
mínima segura, se ha realizado el levantamiento de requisitos.

```
A. Requisitos Funcionales
```
```
RF-01: Integración de visores
El sistema mostrará tanto el visor 3D como el visualizador de fractales en la misma
aplicación, con posibilidad de cambiar entre vistas o mostrarlas simultáneamente en
paneles.
```

```
RF-02: Autenticación y gestión de usuarios
Registro, login y logout.
Recuperación de contraseña (correo o token) implementación mínima.
```
```
RF-03: Historial de usuario
Registrar acciones importantes: creación/edición/eliminación de proyectos,
exportaciones, ejecución de pruebas.
```
```
RF-04: Guardado y recuperación de proyectos
Guardar proyecto con metadatos: nombre, autor, timestamp, parámetros del
fractal/escena, thumbnail opcional.
Listar, abrir, actualizar y eliminar proyectos por usuario.
```
```
RF-05: Configuraciones por usuario
Guardar preferencias (calidad, controles de cámara, presets) y aplicarlas al iniciar
sesión.
```
```
RF-06: Notificaciones
Mostrar notificaciones en la UI (éxito/error/progreso) y permitir ver un historial
breve.
```
```
RF-07: Exportación
Exportar imágenes PNG de alta resolución y archivos de proyecto (JSON) para
descarga.
```
```
RF-08: API REST
Endpoints para autenticación, proyectos, historial, notificaciones y exportaciones.
```
```
B. Requisitos no Funcionales
```
```
Categoría Descripción Clasificac
ión
```
```
Criterio de aceptación
```
**Seguridad
(autenticación,
autorización,
protección de
datos)**

```
Mecanismos para asegurar que
solo usuarios autorizados
acceden a recursos y que los
datos sensibles están
protegidos en tránsito y en
reposo.
```
```
Necesario Contraseñas hasheadas con
algoritmo seguro (bcrypt/argon2),
uso de JWT para sesiones con
expiración, TLS en transporte,
cabeceras de seguridad (Helmet) y
control de permisos en endpoints.
```

```
Validación y
sanitización de
entradas
```
```
Validación de todos los datos
recibidos por la API y
escape/sanitización para evitar
inyección SQL/NoSQL, XSS y
otros vectores.
```
```
Necesario Reglas de validación en backend
para payloads; pruebas que
demuestren resistencia a
inyección y XSS en campos de
entrada.
```
```
Trazabilidad y
registro
(logging,
auditoría)
```
```
Registro estructurado de
eventos relevantes para
auditoría, depuración y análisis
forense (historial de usuario,
errores del sistema, acciones
críticas).
```
```
Necesario Eventos importantes registrados
con usuario, timestamp y detalles;
posibilidad de consultar y
exportar logs con permisos
adecuados.
```
```
Privacidad y
cumplimiento
(protección de
datos
personales)
```
```
Políticas y mecanismos para el
manejo responsable de datos
personales (minimización,
retención, borrado) y
cumplimiento legal básico.
```
```
Necesario Documentación de política de
privacidad, retención configurable
y capacidad para borrar datos de
un usuario a petición.
```
```
Rendimiento y
capacidad
(latencia,
throughput,
renderizado)
```
```
Requisitos sobre tiempos de
respuesta del frontend y
backend, y eficiencia en el
renderizado WebGL para
ofrecer una experiencia fluida.
```
```
Deseable Páginas críticas y endpoints con
latencia aceptable (<300 ms en
entorno de prueba), render
interactivo sin lag en hardware
moderno.
```
```
Disponibilidad
y continuidad
(despliegue,
backups)
```
```
Medidas para mantener el
servicio accesible y garantizar
recuperación ante fallos
(backups y procedimientos de
restauración).
```
```
Deseable Despliegue con HTTPS;
scripts/instrucciones para
backup/restore y verificación de
restauración en entorno de
pruebas.
```
**Escalabilidad y
arquitectura
(posibilidad de
escalar)**

```
Capacidad de la solución para
ser escalada horizontal o
verticalmente cuando sea
necesario.
```
```
Opcional
en fase 1 /
Deseable
para
producció
n
```
```
Documentación sobre cómo
escalar servicios y separación
clara de componentes (frontend,
backend, DB).
```

**Mantenibilidad
y modularidad**

```
Código y estructura del
proyecto que faciliten
mantenimiento, pruebas y
extensión (buenas prácticas,
modularidad y testing).
```
```
Necesario Código organizado en módulos,
guía de contribución, pruebas
unitarias básicas y CI configurado
para ejecutar tests.
```
**Observabilidad
y
monitorización**

```
Métricas, alertas y logs que
permitan monitorizar la salud
del sistema y responder a
incidentes.
```
```
Deseable Integración mínima con sistema
de métricas/logs
(Prometheus/ELK) o
documentación para habilitarla;
dashboard básico opcional.
```
```
Rate limiting y
protección
contra abuso
```
```
Mecanismos para limitar
peticiones y proteger la API
frente a uso malicioso o
sobrecarga.
```
```
Deseable Política mínima de rate-limiting
documentada o implementada
(por IP o usuario) en endpoints
críticos.
```
```
Disponibilidad
de la API y
versionado
```
```
Garantizar estabilidad de la
API con versionado que
permita cambios sin romper
clientes.
```
```
Deseable Rutas versionadas (/api/v1/...) y
documentación sobre política de
deprecación.
```
```
Usabilidad y
experiencia de
usuario (UX)
```
```
Interfaz clara, consistente y
accesible que facilite el uso del
visor y las funciones de
guardado/carga.
```
```
Necesario Pruebas de UX básicas con
checklist (coherencia de UI,
visibilidad de estados, flujos de
guardado/carga) completadas.
```
```
Accesibilidad
(WCAG
básicas)
```
```
Soporte básico de accesibilidad
(contraste, navegación por
teclado, etiquetas semánticas)
para componentes críticos.
```
```
Opcional /
Deseable
```
```
Revisión básica aplicada a
componentes principales; lista de
acciones pendientes documentada.
```
```
Portabilidad
(soporte para
distintos
entornos de
despliegue)
```
```
Capacidad de ejecutar la
aplicación en entornos locales
y servidores cloud comunes sin
cambios mayores.
```
```
Deseable Dockerfile y scripts de arranque
que permitan desplegar en
entornos locales y en un
VPS/cloud.
```
```
Testabilidad
(automatizació
n de pruebas)
```
```
Facilidad para crear y ejecutar
pruebas automatizadas
(unitarias, integración y e2e)
que verifiquen comportamiento
esperado.
```
```
Necesario Suite de pruebas mínima
(unidades + 1–2 tests de
integración) y guía para ejecutar
pruebas.
```

```
Legal y
cumplimiento
(licencias,
avisos)
```
```
Identificación de licencias de
dependencias y avisos legales
mínimos requeridos por la
organización.
```
```
Opcional /
Necesario
según
contexto
```
```
Lista de dependencias con
licencias y recomendaciones;
incluir avisos en README si
aplica.
```
```
Rendimiento
del frontend
móvil
```
```
Requisitos específicos para
asegurar que la interfaz es
usable en dispositivos móviles
de gama media.
```
```
Opcional /
Deseable
```
```
Interfaz usable en resolución
móvil básica; pruebas manuales
en un dispositivo representativo.
```
```
Backup y
recuperación
```
```
Procedimientos y scripts para
respaldar y restaurar datos de
la base de datos del proyecto.
```
```
Deseable Script de backup y restore
probado en entorno de prueba.
```
```
Documentación
y formación
```
```
Documentación para usuarios
y desarrolladores (manual de
usuario, guía de despliegue y
contribución).
```
```
Necesario README con instalación, uso y
guía de contribución;
documentación mínima para
pruebas de seguridad.
```
```
C. Análisis de Pruebas
```
**_Proyecto:_** _VisualLab_
**_Fecha de Análisis:_** _5 de noviembre de 2025_
**_Versión del Proyecto:_** _1._
**_Estado del Quality Gate:_** _PASSED_ ✓

El proyecto VisualLab ha sido sometido a un análisis estático de código utilizando la
plataforma SonarQube. Los resultados indican que el proyecto ha superado satisfactoriamente
el Quality Gate establecido, sin embargo, se han identificado 276 issues que requieren
atención para mejorar la calidad general del código.

El análisis revela que no existen vulnerabilidades de seguridad críticas ni bugs bloqueantes,
lo cual representa un aspecto positivo del proyecto. No obstante, se han detectado áreas
significativas de mejora relacionadas con la mantenibilidad del código, la cobertura de
pruebas y el cumplimiento de estándares modernos de desarrollo.


### 2. MÉTRICAS PRINCIPALES

```
Métrica Valor Estado
```
```
Quality Gate Passed ✓
```
```
Total de Issues 276 Requiere atención
```
```
Cobertura de Código 0.0% Crítico
```
```
Duplicación de Código 13.0% Alto
```
```
Security Hotspots 21 Requiere revisión
```
```
Tiempo Estimado de Resolución 1d 4h Manejable
```
### 3. DISTRIBUCIÓN DE ISSUES

**_3.1 Por Categoría de Calidad_**

```
Categoría Cantidad Porcentaje
```
```
Mantenibilidad 266 96.4%
```
```
Confiabilidad 43 15.6%
```
```
Seguridad 2 0.7%
```

**_3.2 Por Severidad_**

```
Nivel Cantidad Porcentaje
```
```
High 11 4.0%
```
```
Medium 74 26.8%
```
```
Low 224 81.2%
```
```
Blocker 0 0% ✓
```
**_3.3 Por Atributo de Código_**

```
Atributo Cantidad Descripción
```
```
Consistencia 187 68% - Problemas de formateo y estilo
```
```
Intencionalidad 85 31% - Claridad del código
```
```
Adaptabilidad 4 1% - Facilidad de modificación
```

### 4. PRINCIPALES PROBLEMAS IDENTIFICADOS

**_4.1 Top 5 Issues Más Frecuentes_**

```
# Tipo de Issue Cantidad Impacto
```
(^1) _Decimales innecesarios (ej. 1.0 → 1 ) 130 Consistencia
2 Funciones globales vs métodos Number.* 27 Convención ES
3 Uso de .forEach() vs for...of 17 Performance
4 Uso de window vs globalThis 9 Portabilidad
5 Variables sin utilizar 7 Código muerto_
**_4.2 Archivos Más Problemáticos
Archivo Issues Observación Principal_**
_controls.js 47 Problemas de formateo
julia.js 27 Literales numéricos
base-fractal.js 19 Formateo y convenciones
webgl-utils.js 19 Convenciones ES_


```
fractal-tree.js 17 Método con 8 parámetros (límite: 7)
```
```
app.js 16 Complejidad cognitiva 27/
```
### 5. PROBLEMAS CRÍTICOS

**_5.1 Cobertura de Pruebas: 0.0%_**

**_Evaluación:_** _CRÍTICO_

_El proyecto carece completamente de pruebas automatizadas, lo cual representa el riesgo
más significativo identificado. Aproximadamente 2,500 líneas de código no tienen cobertura._

**_Impacto:_**

```
● Imposibilidad de validar comportamiento automáticamente
● Alto riesgo en refactorizaciones
● Dificultad para detectar regresiones
```
**_5.2 Complejidad Cognitiva Elevada_**

**_Archivo:_** _app.js (línea 359)_
**_Complejidad:_** _27 (límite: 15)_
**_Severidad:_** _High_

_Una función excede significativamente el umbral recomendado de complejidad, dificultando
su mantenimiento y comprensión._

**_5.3 Accesibilidad (WCAG 2.0 Nivel A)_**

**_Total:_** _5 issues_

```
● 4 elementos sin atributos aria-label o aria-labelledby
● 1 label no asociado con su control
```
**_Archivos afectados:_** _app-scientific.html, index.html, ejemplo.html_

### 6. SEGURIDAD

**_6.1 Evaluación_**

```
● Security Hotspots: 21 (clasificación E - requiere revisión manual)
● Issues de Seguridad: 2 (severidad Medium, categoría "OWASP Others")
```

```
● Vulnerabilidades Críticas: 0 ✓
```
**_Conclusión:_** _No se identificaron vulnerabilidades críticas. Los security hotspots requieren
revisión manual para descartar falsos positivos._

### 7. OTROS PROBLEMAS SIGNIFICATIVOS

**_7.1 Código Muerto_**

```
● Variables sin usar: 7 casos (viewportChanged, name, branchCount)
● Asignaciones inútiles: 6 casos
● Nombres duplicados: 5 casos (resize, updateGPUInfo, etc.)
```
**_7.2 CSS Duplicado_**

```
● 5 selectores duplicados en main.css
● Afecta mantenibilidad y puede causar comportamientos inesperados
```
**_7.3 Duplicación de Código_**

```
● Porcentaje: 13.0% (~2,210 líneas de 17,000)
● Aumenta esfuerzo de mantenimiento y probabilidad de bugs
```
### 8. PLAN DE ACCIÓN RECOMENDADO

**_Fase 1: Crítico (Semanas 1-2)_**

**_Prioridad: ALTA_**

_1._ **_Implementar Suite de Pruebas_**
    _○ Objetivo: 30% cobertura mínima_
    _○ Esfuerzo: 3-5 días_
    _○ Enfoque: Funciones críticas de fractales
2._ **_Resolver Accesibilidad_**
    _○ 5 issues WCAG 2._
    _○ Esfuerzo: 1 hora
3._ **_Revisar Security Hotspots_**
    _○ 21 puntos a validar_
    _○ Esfuerzo: 4-6 horas
4._ **_Reducir Complejidad en app.js_**
    _○ Refactorizar función compleja_
    _○ Esfuerzo: 2-3 horas_

**_Fase 2: Refactorización (Semanas 3-4)_**


**_Prioridad: MEDIA_**

_1. Eliminar código muerto (13 issues)
2. Consolidar CSS duplicado (5 selectores)
3. Refactorizar método con exceso de parámetros
4. Reducir duplicación de código de 13% a <10%_

**_Fase 3: Modernización (Semanas 5-6)_**

**_Prioridad: BAJA_**

_1. Configurar ESLint y Prettier
2. Migrar a métodos ES2015+ (36 casos)
3. Optimizar loops (.forEach → for...of)
4. Aplicar modernización DOM_

### 9. HERRAMIENTAS RECOMENDADAS

_1._ **_ESLint:_** _Para eliminar problemas de formateo automáticamente
2._ **_Prettier:_** _Para consistencia de estilo
3._ **_Jest/Vitest:_** _Para implementar suite de pruebas
4._ **_axe DevTools:_** _Para validación de accesibilidad
5._ **_CI/CD Integration:_** _Integrar SonarQube en pipeline_

### 10. ASPECTOS POSITIVOS

```
● Quality Gate aprobado
● Sin vulnerabilidades críticas
● Sin bugs bloqueantes
● Estructura de proyecto bien organizada
● 68% de issues son solo formateo (resolución automática)
● 81.2% de issues son de baja severidad
```

**Conclusión:**

El desarrollo del segundo informe del proyecto VisualLab 3D permitió consolidar una base
sólida para la integración de las aplicaciones Interactive 3D Viewer y FractalLab dentro de
una única plataforma web. A través del levantamiento detallado de los requisitos funcionales
y no funcionales, se logró definir con claridad las características esenciales del sistema, los
criterios de calidad esperados y las condiciones necesarias para su correcto funcionamiento.

La especificación de los requisitos funcionales permitió establecer los módulos principales
del sistema, como la autenticación de usuarios, la gestión de proyectos, el historial de
actividades y la exportación de resultados, asegurando que el producto final responda a las
necesidades identificadas. De igual forma, la definición de los requisitos no funcionales
contribuyó a garantizar aspectos de seguridad, rendimiento, mantenibilidad y usabilidad,
indispensables para la sostenibilidad del sistema a largo plazo.

La adopción de la Arquitectura Hexagonal como modelo de diseño técnico resultó coherente
con los objetivos del proyecto, al ofrecer una estructura modular que facilita la escalabilidad,
la prueba de componentes y la independencia entre el frontend y el backend. Esta elección
arquitectónica sienta las bases para un desarrollo ordenado, adaptable y de fácil
mantenimiento.

Asimismo, la incorporación de SonarQube como herramienta de análisis de calidad de código
permitió evaluar el estado actual de las aplicaciones, identificando fortalezas y áreas de
mejora. El análisis reveló la necesidad de optimizar la mantenibilidad, reducir la duplicación
de código e implementar pruebas automatizadas, acciones que resultan prioritarias para
alcanzar un producto más robusto y confiable.

En conjunto, los resultados obtenidos en esta fase confirman que el proyecto avanza de
manera alineada con sus objetivos generales y específicos. La documentación generada, junto
con las métricas de calidad recopiladas, proporcionan los insumos necesarios para la
siguiente etapa de implementación, enfocada en la integración definitiva de los módulos, la
validación de la arquitectura y el aseguramiento de la calidad del software.


