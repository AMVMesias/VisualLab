# 🎓 Plataforma Educativa - Visualizadores Interactivos

> Plataforma web educativa con visualizadores de fractales y figuras 3D

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646cff)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 Descripción

Plataforma educativa interactiva que integra dos visualizadores científicos:

- **🔷 FractalLab**: Exploración de fractales matemáticos (Mandelbrot, Julia, Sierpinski, etc.)
- **🎲 Visor 3D**: Visualización interactiva de figuras geométricas en 3D

Sistema completo con autenticación, guardado automático y exportación de configuraciones.

---

## ✨ Características

- ✅ **Sistema de Login** con usuarios predefinidos
- ✅ **Dashboard** con cards de proyectos
- ✅ **Auto-guardado** cada 30 segundos
- ✅ **Exportar/Importar** configuraciones en JSON
- ✅ **Almacenamiento local** en navegador (localStorage)
- ✅ **Interfaz moderna** con Heroicons
- ✅ **Arquitectura modular** y escalable

---

## 🚀 Inicio Rápido

```bash
# 1. Navegar al proyecto
cd edu-platform

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir navegador en:
http://localhost:3001
```

### 🔑 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `estudiante1` | `demo123` | Estudiante |
| `profesor1` | `profesor123` | Profesor |
| `admin` | `admin123` | Admin |

---

## 📚 Documentación Completa

📖 **[LEE LA DOCUMENTACIÓN COMPLETA AQUÍ](../DOCUMENTACION_COMPLETA.md)**

Un único documento con TODO lo que necesitas saber:
- ✅ Guía de instalación paso a paso
- ✅ Guía de uso completa
- ✅ Usuarios y credenciales
- ✅ Explicación del almacenamiento
- ✅ Estructura del código
- ✅ Arquitectura detallada
- ✅ Preguntas frecuentes
- ✅ Solución de problemas
- ✅ **Con índice navegable**

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.2.0 | Librería UI |
| **React Router** | 6.20.0 | Navegación SPA |
| **Zustand** | 4.4.7 | Gestión de estado |
| **Vite** | 5.4.21 | Build tool |
| **Heroicons** | 2.x | Iconos |
| **Node.js** | ≥14 | Runtime |

---

## 📂 Estructura del Proyecto

```
edu-platform/
├── 📁 documentacion/       ← 📚 TODA LA DOCUMENTACIÓN AQUÍ
│   ├── guias/              ← Guías de instalación y uso
│   ├── credenciales/       ← Usuarios y almacenamiento
│   └── arquitectura/       ← Estructura del código
│
├── 📁 public/              ← Proyectos integrados (iframes)
│   ├── fractals-app/       ← Visualizador de fractales
│   └── 3d-app/             ← Visualizador 3D
│
├── 📁 src/                 ← Código fuente React
│   ├── core/               ← App.jsx, main.jsx
│   ├── features/           ← auth, dashboard, viewers
│   │   ├── auth/           ← Sistema de autenticación
│   │   ├── dashboard/      ← Panel principal
│   │   └── viewers/        ← Visualizadores
│   ├── shared/             ← Componentes compartidos
│   ├── config/             ← Configuración global
│   └── assets/             ← Estilos y recursos
│
├── 📄 package.json         ← Dependencias
├── 📄 vite.config.js       ← Configuración de Vite
└── 📄 README.md            ← Este archivo
```

> **Detalles completos:** [DIRECTORY_STRUCTURE.md](documentacion/arquitectura/DIRECTORY_STRUCTURE.md)

---

## 🎮 Uso

### 1️⃣ Iniciar Sesión
Usa cualquiera de los usuarios de prueba

### 2️⃣ Dashboard
Verás dos proyectos disponibles con su estado

### 3️⃣ Trabajar
- Click en "Comenzar" o "Continuar"
- Auto-guardado cada 30 segundos
- Volver con el botón "← Volver al Dashboard"

### 4️⃣ Exportar/Importar
- Exporta tu configuración como JSON
- Importa configuraciones previas

> **Guía detallada:** [GUIA_USO.md](documentacion/guias/GUIA_USO.md)

---

## 💾 Almacenamiento

Todo se guarda en **localStorage** del navegador:

- `auth-storage` → Sesión actual
- `project-storage` → Configuraciones de proyectos  
- `edu_platform_users` → Base de datos de usuarios

> **Detalles completos:** [USUARIOS_PRUEBA.md - Almacenamiento](documentacion/credenciales/USUARIOS_PRUEBA.md#-almacenamiento-de-datos)

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

---

## 🌐 Navegadores Compatibles

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (no soportado)

---

## ⚠️ Notas de Seguridad

🚨 **Este proyecto es solo para desarrollo/educación**

- Contraseñas en texto plano (no usar en producción)
- Sin hash de contraseñas
- Sin backend real
- Datos solo en localStorage

---

## 🆘 Ayuda

### ¿Problemas de instalación?
→ [INSTALACION.md - Solución de Problemas](documentacion/guias/INSTALACION.md#️-solución-de-problemas)

### ¿Cómo funciona algo?
→ [GUIA_USO.md](documentacion/guias/GUIA_USO.md)

### ¿Dónde está el código de X?
→ [DIRECTORY_STRUCTURE.md](documentacion/arquitectura/DIRECTORY_STRUCTURE.md)

### ¿Dónde se guardan los datos?
→ [USUARIOS_PRUEBA.md - Almacenamiento](documentacion/credenciales/USUARIOS_PRUEBA.md#-almacenamiento-de-datos)

---

## 📝 Licencia

MIT License - Proyecto educativo

---

## 👥 Autores

Proyecto educativo - Universidad

---

## 🔗 Enlaces Rápidos

- 📚 [Documentación Completa](documentacion/README.md)
- 🚀 [Instalación](documentacion/guias/INSTALACION.md)
- 🎯 [Guía de Uso](documentacion/guias/GUIA_USO.md)
- 🔐 [Usuarios](documentacion/credenciales/USUARIOS_PRUEBA.md)
- 🏗️ [Arquitectura](documentacion/arquitectura/DIRECTORY_STRUCTURE.md)

---

<p align="center">
  <strong>🎨 Plataforma Educativa v1.0.0</strong><br>
  <em>Visualizadores Interactivos de Fractales y Figuras 3D</em>
</p>

<p align="center">
  <sub>Consulta la <a href="documentacion/">documentación completa</a> para más información</sub>
</p>
