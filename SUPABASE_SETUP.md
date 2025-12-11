# 🎯 Guía de Implementación - Supabase + VisualLab 3D

## ✅ Cambios Implementados

### 1. **Configuración de Supabase**
- ✅ Archivo `src/config/supabase.js` configurado
- ⚠️ **ACCIÓN REQUERIDA:** Actualizar `.env` con tu anon key correcta

### 2. **Base de Datos**
- ✅ Script SQL creado en `database/schema.sql`
- ✅ Tablas: `projects`, `user_preferences`, `activity_log`
- ✅ Políticas de seguridad (Row Level Security)
- ✅ Triggers automáticos para timestamps

### 3. **Stores Actualizados**
- ✅ `authStore.js` → Autenticación con Supabase
- ✅ `projectStore.js` → CRUD de proyectos con Supabase

### 4. **Componentes Actualizados**
- ✅ `Login.jsx` → Ahora usa email en lugar de username
- ✅ `Register.jsx` → Registro real con Supabase
- ✅ `ForgotPassword.jsx` → Recuperación de contraseña funcional

---

## 🚀 Pasos Siguientes (IMPORTANTE)

### **Paso 1: Obtener la Anon Key Correcta**

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a: **Project Settings → API**
3. Copia estos dos valores:

```
Project URL: https://vsdassduvhbsvhszhnwv.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (KEY LARGA)
```

4. Actualiza tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://vsdassduvhbsvhszhnwv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (copia aquí)
```

### **Paso 2: Crear las Tablas en Supabase**

1. Ve a: **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido de `database/schema.sql`
3. Haz clic en **Run** para ejecutar el script

### **Paso 3: Configurar Autenticación**

1. Ve a: **Authentication → Settings** en Supabase
2. Configura:
   - ✅ Enable Email Confirmations (opcional para desarrollo)
   - ✅ Email Templates (personalizar si lo deseas)

### **Paso 4: Reiniciar el Servidor**

```powershell
# Detener el servidor actual (Ctrl+C si está corriendo)
npm run dev
```

---

## 📋 Funcionalidades Disponibles

### **Autenticación**
- ✅ Registro de usuarios con email/contraseña
- ✅ Login con email/contraseña
- ✅ Logout
- ✅ Recuperación de contraseña
- ✅ Verificación de email (opcional)

### **Gestión de Proyectos**
- ✅ Crear proyectos (3D o Fractales)
- ✅ Listar proyectos del usuario
- ✅ Actualizar proyectos
- ✅ Eliminar proyectos
- ✅ Filtrar por tipo (3d/fractal)
- ✅ Exportar/Importar configuraciones

### **Historial de Actividades**
- ✅ Registro automático de acciones
- ✅ Consulta de historial

### **Seguridad**
- ✅ Row Level Security (RLS)
- ✅ Políticas de acceso por usuario
- ✅ Contraseñas hasheadas automáticamente
- ✅ Tokens JWT seguros

---

## 🧪 Cómo Probar

### 1. **Registrar un usuario**
```
Email: test@example.com
Contraseña: password123
Username: testuser
```

### 2. **Iniciar sesión**
```
Email: test@example.com
Contraseña: password123
```

### 3. **Crear un proyecto**
```javascript
// En el Dashboard o viewer
const result = await createProject({
  name: "Mi Primer Proyecto",
  type: "3d", // o "fractal"
  config: {
    // Tu configuración aquí
    camera: { position: [0, 0, 5] }
  }
})
```

---

## 🔧 APIs Disponibles en los Stores

### **authStore**
```javascript
import { useAuthStore } from './features/auth/store/authStore'

const { 
  register,          // (email, password, metadata) => Promise
  login,             // (email, password) => Promise
  logout,            // () => Promise
  resetPassword,     // (email) => Promise
  user,              // Usuario actual
  isAuthenticated,   // boolean
  loading,           // boolean
  error              // string | null
} = useAuthStore()
```

### **projectStore**
```javascript
import { useProjectStore } from './features/viewers/store/projectStore'

const {
  fetchProjects,          // () => Promise
  fetchProjectsByType,    // (type) => Promise
  createProject,          // (projectData) => Promise
  updateProject,          // (id, updates) => Promise
  deleteProject,          // (id) => Promise
  loadProject,            // (id) => Promise
  exportProjectConfig,    // (project) => string
  importProjectConfig,    // (json, name) => Promise
  fetchActivityLog,       // (limit) => Promise
  projects,               // Array
  currentProject,         // Object | null
  loading,                // boolean
  error                   // string | null
} = useProjectStore()
```

---

## ⚠️ Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste la **anon public key** correcta (no la publishable key)
- La key debe empezar con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Error: "relation does not exist"
- No ejecutaste el script SQL
- Ve al SQL Editor y ejecuta `database/schema.sql`

### Error: "Email not confirmed"
- Desactiva la verificación de email en: Authentication → Settings → Email Confirmations

### No se pueden crear proyectos
- Verifica que estás autenticado: `useAuthStore.getState().isAuthenticated`
- Revisa las políticas RLS en Supabase

---

## 📚 Documentación Adicional

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Próximos Pasos

Una vez que tengas todo funcionando:

1. Implementar almacenamiento de imágenes (thumbnails)
2. Agregar paginación a la lista de proyectos
3. Implementar búsqueda y filtros avanzados
4. Crear dashboard con estadísticas
5. Agregar colaboración entre usuarios
