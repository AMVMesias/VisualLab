# Testing - VisualLab

## Resumen

Este documento describe las convenciones de testing, estructura y comandos para ejecutar pruebas en el proyecto VisualLab.

## Stack de Testing

| Herramienta | Propósito |
|-------------|-----------|
| **Vitest** | Framework de testing (compatible con Jest) |
| **@testing-library/react** | Testing de componentes React |
| **@testing-library/jest-dom** | Matchers adicionales para DOM |
| **@testing-library/user-event** | Simulación de eventos de usuario |
| **jsdom** | Entorno DOM para Node.js |

## Comandos

```bash
# Ejecutar tests una vez
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests con reporte de coverage
npm run test:coverage
```

## Estructura de Tests

```
src/tests/
├── setup.js                    # Configuración global
├── mocks/
│   └── supabase.mock.js       # Mock de Supabase
├── unit/
│   ├── auth/
│   │   └── authStore.test.js  # Tests de authStore
│   └── viewers/
│       └── projectStore.test.js # Tests de projectStore
└── integration/
    ├── auth/
    │   ├── Login.test.jsx     # Tests de Login
    │   └── Register.test.jsx  # Tests de Register
    └── dashboard/
        └── Dashboard.test.jsx # Tests de Dashboard
```

## Convenciones

### Nomenclatura de Archivos

- Tests unitarios: `*.test.js`
- Tests de integración de componentes: `*.test.jsx`
- Mocks: `*.mock.js`

### Estructura de Tests

```javascript
describe('NombreComponente', () => {
  describe('Categoría de prueba', () => {
    it('debe hacer algo específico', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Patrones de Testing

#### 1. Tests Unitarios (Stores)

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de dependencias antes de importar
vi.mock('../path/to/dependency', () => ({
  dependency: vi.fn()
}))

import { useStore } from '../path/to/store'

describe('storeName', () => {
  beforeEach(() => {
    // Resetear estado
    useStore.setState({ /* estado inicial */ })
    vi.clearAllMocks()
  })

  it('debe hacer algo', async () => {
    const result = await useStore.getState().someAction()
    expect(result.success).toBe(true)
  })
})
```

#### 2. Tests de Integración (Componentes)

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Component from '../path/to/Component'

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>
  )
}

describe('Component', () => {
  it('debe renderizar correctamente', () => {
    renderComponent()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('debe manejar interacción', async () => {
    const user = userEvent.setup()
    renderComponent()
    
    await user.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('Resultado')).toBeInTheDocument()
    })
  })
})
```

## Mocks

### Supabase Mock

El archivo `supabase.mock.js` proporciona:

- `mockUser` - Usuario de prueba confirmado
- `mockUserUnconfirmed` - Usuario sin confirmar email
- `mockSession` - Sesión de prueba
- `mockProject` / `mockProjects` - Proyectos de prueba
- `mockAuthApi` - API de autenticación mockeada
- `mockSupabase` - Cliente Supabase completo mockeado

### Cómo Mockear Supabase

```javascript
vi.mock('../../../config/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })
    }
  }
}))
```

## Coverage

### Objetivo Mínimo

- **Statements**: 30%
- **Branches**: 25%
- **Functions**: 30%
- **Lines**: 30%

### Ver Reporte de Coverage

```bash
npm run test:coverage
```

El reporte HTML se genera en `./coverage/index.html`.

## Mejores Prácticas

1. **Aislar tests**: Cada test debe ser independiente
2. **Limpiar después**: Usar `beforeEach` para resetear estado
3. **Nombres descriptivos**: Los nombres deben describir el comportamiento esperado
4. **AAA Pattern**: Arrange, Act, Assert
5. **Evitar detalles de implementación**: Testear comportamiento, no implementación
6. **Mocks claros**: Documentar qué se está mockeando y por qué

## Solución de Problemas

### Error: "Cannot find module"
Verificar que las rutas de importación son correctas y que los mocks se definen antes de importar el módulo.

### Error: "act() warnings"
Envolver actualizaciones de estado en `waitFor` o usar `userEvent.setup()`.

### Tests lentos
Usar `vi.useFakeTimers()` para tests que involucran timeouts.

## Añadir Nuevos Tests

1. Crear archivo en la carpeta correspondiente (`unit/` o `integration/`)
2. Seguir las convenciones de nomenclatura
3. Importar mocks necesarios antes de importar el módulo a testear
4. Ejecutar `npm test` para verificar
