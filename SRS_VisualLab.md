# Especificación de Requisitos de Software (SRS) - VisualLab 3D

**Proyecto:** VisualLab 3D  
**Fecha:** 01 de Diciembre de 2025  
**Versión:** 1.0  

---

## 1. Introducción

Este documento especifica los requisitos funcionales y no funcionales para el sistema **VisualLab 3D**, una plataforma web integrada para la visualización y edición de fractales y escenas 3D. El sistema integra los módulos *Interactive 3D Viewer* y *FractalLab* bajo una arquitectura unificada.

---

## 2. Requisitos Funcionales

### Módulo de Visualización e Integración

**ID:** REQ-F-001  
**Título:** Visualización Integrada de Modelos 3D y Fractales  
**Tipo:** Funcional  
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir al usuario visualizar tanto escenas 3D como fractales generados matemáticamente dentro de la misma interfaz de aplicación (Single Page Application). El usuario debe poder alternar entre vistas o visualizarlas simultáneamente.  
**Criterios de Aceptación:**  
- **Given:** El usuario ha accedido a la aplicación principal.  
- **When:** Selecciona la opción de "Vista Dividida" o navega entre las pestañas de "Visor 3D" y "Fractales".  
- **Then:** La aplicación renderiza ambos contextos gráficos (WebGL) sin errores y permite la interacción independiente en cada panel.  
**Dependencias:** Librerías de renderizado (Three.js / WebGL nativo).  
**Trazabilidad:** RF-01 (Informe)

---

### Módulo de Autenticación y Usuarios

**ID:** REQ-F-002  
**Título:** Registro de Nuevo Usuario  
**Tipo:** Funcional  
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir el registro de nuevos usuarios mediante correo electrónico y contraseña segura.  
**Criterios de Aceptación:**  
- **Given:** Un usuario anónimo en la pantalla de registro.  
- **When:** Introduce un correo válido y una contraseña que cumple las políticas de seguridad (mínimo 8 caracteres, al menos un número y un carácter especial).  
- **Then:** El sistema crea el registro en la base de datos, hashea la contraseña y redirige al login o dashboard.  
**Dependencias:** API Backend (Endpoint `/auth/register`).  
**Trazabilidad:** RF-02 (Informe)

**ID:** REQ-F-003  
**Título:** Inicio de Sesión (Login)  
**Tipo:** Funcional  
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir a los usuarios registrados autenticarse para acceder a sus proyectos y configuraciones.  
**Criterios de Aceptación:**  
- **Given:** Un usuario registrado en la pantalla de login.  
- **When:** Introduce credenciales correctas.  
- **Then:** El sistema genera un token de sesión (JWT), lo almacena de forma segura y concede acceso al área privada.  
**Dependencias:** API Backend (Endpoint `/auth/login`), Servicio de Token (JWT).  
**Trazabilidad:** RF-02 (Informe)

**ID:** REQ-F-004  
**Título:** Recuperación de Contraseña  
**Tipo:** Funcional  
**Prioridad:** Media  
**Descripción:** El sistema debe proporcionar un mecanismo para que los usuarios restablezcan su contraseña en caso de olvido.  
**Criterios de Aceptación:**  
- **Given:** Un usuario que ha olvidado su contraseña.  
- **When:** Solicita la recuperación ingresando su correo registrado.  
- **Then:** El sistema envía un enlace o token temporal al correo para definir una nueva contraseña.  
**Dependencias:** Servicio de Correo (SMTP).  
**Trazabilidad:** RF-02 (Informe)

---

### Módulo de Gestión de Proyectos

**ID:** REQ-F-005  
**Título:** Gestión de Proyectos (CRUD)  
**Tipo:** Funcional  
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir a los usuarios Crear, Leer (listar/abrir), Actualizar y Eliminar proyectos. Un proyecto encapsula el estado de una escena 3D o la configuración de un fractal.  
**Criterios de Aceptación:**  
- **Given:** Un usuario autenticado en el dashboard.  
- **When:** El usuario guarda una configuración actual como "Nuevo Proyecto".  
- **Then:** El sistema persiste los metadatos (nombre, fecha, autor) y los parámetros técnicos (JSON) en la base de datos.  
- **When:** El usuario solicita eliminar un proyecto propio.  
- **Then:** El proyecto se marca como eliminado o se borra físicamente y desaparece de la lista.  
**Dependencias:** Base de Datos, API Backend.  
**Trazabilidad:** RF-04 (Informe)

**ID:** REQ-F-006  
**Título:** Exportación de Resultados  
**Tipo:** Funcional  
**Prioridad:** Media  
**Descripción:** El sistema debe permitir exportar la visualización actual como imagen de alta resolución (PNG) y la configuración del proyecto como archivo de texto (JSON).  
**Criterios de Aceptación:**  
- **Given:** Un proyecto abierto con una visualización renderizada.  
- **When:** El usuario hace clic en "Exportar Imagen".  
- **Then:** Se descarga un archivo .png con la resolución actual del canvas.  
- **When:** El usuario hace clic en "Exportar Proyecto".  
- **Then:** Se descarga un archivo .json con los parámetros necesarios para reconstruir la escena.  
**Dependencias:** Funcionalidad del navegador (Canvas API).  
**Trazabilidad:** RF-07 (Informe)

---

### Módulo de Historial y Configuraciones

**ID:** REQ-F-007  
**Título:** Registro de Historial de Actividades  
**Tipo:** Funcional  
**Prioridad:** Media  
**Descripción:** El sistema debe registrar automáticamente las acciones críticas realizadas por el usuario (creación de proyectos, ediciones, exportaciones).  
**Criterios de Aceptación:**  
- **Given:** Un usuario realizando operaciones en el sistema.  
- **When:** Completa una acción de guardado o exportación.  
- **Then:** Se crea un registro de auditoría visible en la sección de "Historial" del usuario.  
**Dependencias:** API Backend (Logging service).  
**Trazabilidad:** RF-03 (Informe)

**ID:** REQ-F-008  
**Título:** Persistencia de Preferencias de Usuario  
**Tipo:** Funcional  
**Prioridad:** Media  
**Descripción:** El sistema debe guardar las preferencias de interfaz y renderizado (calidad gráfica, controles de cámara, tema) asociadas al perfil del usuario.  
**Criterios de Aceptación:**  
- **Given:** Un usuario que modifica la configuración de calidad a "Alta".  
- **When:** Cierra sesión y vuelve a entrar.  
- **Then:** La aplicación carga con la configuración de calidad "Alta" por defecto.  
**Dependencias:** Base de Datos (Tabla de perfiles/configuraciones).  
**Trazabilidad:** RF-05 (Informe)

---

## 3. Requisitos No Funcionales

**ID:** REQ-NF-001  
**Título:** Seguridad de Datos y Comunicaciones  
**Tipo:** No Funcional (Seguridad)  
**Prioridad:** Alta  
**Descripción:** El sistema debe garantizar la confidencialidad e integridad de los datos.  
**Criterios de Aceptación:**  
- Las contraseñas deben almacenarse utilizando algoritmos de hash robustos (ej. bcrypt o Argon2).  
- Toda la comunicación cliente-servidor debe realizarse sobre HTTPS (TLS).  
- Las sesiones deben gestionarse mediante JWT con tiempo de expiración definido.  
**Dependencias:** Configuración del servidor, Librerías de criptografía.  
**Trazabilidad:** Informe (Sección Seguridad)

**ID:** REQ-NF-002  
**Título:** Rendimiento del Renderizado  
**Tipo:** No Funcional (Rendimiento)  
**Prioridad:** Alta  
**Descripción:** La aplicación debe mantener una tasa de cuadros por segundo (FPS) estable para garantizar una experiencia de usuario fluida durante la manipulación de escenas 3D y fractales.  
**Criterios de Aceptación:**  
- El renderizado debe mantener al menos 30 FPS en hardware de gama media durante la interacción básica.  
- La latencia de las respuestas de la API crítica debe ser inferior a 300ms en condiciones normales de red.  
**Dependencias:** Optimización de WebGL, Hardware del cliente.  
**Trazabilidad:** Informe (Sección Rendimiento)

**ID:** REQ-NF-003  
**Título:** Calidad y Mantenibilidad del Código  
**Tipo:** No Funcional (Mantenibilidad)  
**Prioridad:** Alta  
**Descripción:** El código fuente debe cumplir con estándares de calidad para facilitar su mantenimiento y evolución, verificado mediante análisis estático.  
**Criterios de Aceptación:**  
- El proyecto debe superar el Quality Gate de SonarQube.  
- La cobertura de pruebas unitarias debe ser al menos del 30% en la primera fase.  
- No deben existir "Code Smells" críticos ni vulnerabilidades de seguridad detectadas.  
**Dependencias:** SonarQube, Jest/Vitest.  
**Trazabilidad:** Informe (Sección Mantenibilidad y Análisis de Pruebas)

**ID:** REQ-NF-004  
**Título:** Validación y Sanitización de Entradas  
**Tipo:** No Funcional (Seguridad)  
**Prioridad:** Alta  
**Descripción:** Todos los datos enviados a la API deben ser validados y sanitizados para prevenir inyecciones (SQL, NoSQL, XSS).  
**Criterios de Aceptación:**  
- La API debe rechazar payloads que no cumplan con el esquema definido (JSON Schema/Zod).  
- Los inputs de texto deben ser escapados antes de ser procesados o almacenados.  
**Dependencias:** Middleware de validación.  
**Trazabilidad:** Informe (Sección Validación)
