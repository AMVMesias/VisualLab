/**
 * Mock de Supabase para pruebas
 * Simula todas las operaciones de autenticación y base de datos
 */

import { vi } from 'vitest'

// Datos de prueba
export const mockUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    email_confirmed_at: '2024-01-01T00:00:00Z',
    user_metadata: {
        username: 'testuser'
    },
    created_at: '2024-01-01T00:00:00Z'
}

export const mockUserUnconfirmed = {
    id: 'test-user-id-456',
    email: 'unconfirmed@example.com',
    email_confirmed_at: null,
    user_metadata: {
        username: 'unconfirmeduser'
    },
    created_at: '2024-01-01T00:00:00Z'
}

export const mockSession = {
    user: mockUser,
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000
}

export const mockProject = {
    id: 'project-id-123',
    user_id: mockUser.id,
    name: 'Test Project',
    type: '3d',
    config: { setting1: 'value1' },
    thumbnail_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
}

export const mockProjects = [
    mockProject,
    {
        id: 'project-id-456',
        user_id: mockUser.id,
        name: 'Fractal Project',
        type: 'fractal',
        config: { fractalType: 'mandelbrot' },
        thumbnail_url: null,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
    }
]

// Estado del mock
let mockAuthState = {
    user: null,
    session: null
}

// Callbacks de auth state change
let authStateChangeCallbacks = []

// Funciones helper para controlar el mock
export const resetMockAuth = () => {
    mockAuthState = { user: null, session: null }
    authStateChangeCallbacks = []
}

export const setMockAuthState = (user, session = null) => {
    mockAuthState = { user, session: session || (user ? mockSession : null) }
    // Notificar a los listeners
    authStateChangeCallbacks.forEach(cb => {
        cb('SIGNED_IN', mockAuthState.session)
    })
}

// Mock de la API de autenticación
export const mockAuthApi = {
    signUp: vi.fn().mockImplementation(async ({ email, password, options }) => {
        if (email === 'existing@example.com') {
            return {
                data: { user: null, session: null },
                error: { message: 'User already registered' }
            }
        }

        const newUser = {
            ...mockUserUnconfirmed,
            id: `new-user-${Date.now()}`,
            email,
            user_metadata: options?.data || {}
        }

        return {
            data: { user: newUser, session: null },
            error: null
        }
    }),

    signInWithPassword: vi.fn().mockImplementation(async ({ email, password }) => {
        if (email === 'test@example.com' && password === 'password123') {
            mockAuthState = { user: mockUser, session: mockSession }
            return {
                data: { user: mockUser, session: mockSession },
                error: null
            }
        }

        if (email === 'unconfirmed@example.com') {
            return {
                data: { user: mockUserUnconfirmed, session: { ...mockSession, user: mockUserUnconfirmed } },
                error: null
            }
        }

        return {
            data: { user: null, session: null },
            error: { message: 'Invalid login credentials' }
        }
    }),

    signOut: vi.fn().mockImplementation(async () => {
        mockAuthState = { user: null, session: null }
        authStateChangeCallbacks.forEach(cb => {
            cb('SIGNED_OUT', null)
        })
        return { error: null }
    }),

    resetPasswordForEmail: vi.fn().mockImplementation(async (email) => {
        if (!email.includes('@')) {
            return { error: { message: 'Invalid email' } }
        }
        return { error: null }
    }),

    updateUser: vi.fn().mockImplementation(async (updates) => {
        return { data: { user: { ...mockUser, ...updates } }, error: null }
    }),

    getSession: vi.fn().mockImplementation(async () => {
        return { data: { session: mockAuthState.session }, error: null }
    }),

    getUser: vi.fn().mockImplementation(async () => {
        return { data: { user: mockAuthState.user }, error: null }
    }),

    onAuthStateChange: vi.fn().mockImplementation((callback) => {
        authStateChangeCallbacks.push(callback)
        // Llamar inmediatamente con el estado actual
        callback('INITIAL_SESSION', mockAuthState.session)
        return {
            data: { subscription: { unsubscribe: vi.fn() } }
        }
    })
}

// Mock de la API de base de datos
export const createMockDbQuery = () => {
    let query = {
        data: null,
        error: null,
        _table: '',
        _filters: {},
        _orderBy: null,
        _limit: null
    }

    const queryBuilder = {
        select: vi.fn().mockImplementation((columns = '*') => {
            query.data = [...mockProjects]
            return queryBuilder
        }),

        insert: vi.fn().mockImplementation((data) => {
            const newItem = Array.isArray(data) ? data[0] : data
            query.data = { ...mockProject, ...newItem, id: `new-${Date.now()}` }
            return queryBuilder
        }),

        update: vi.fn().mockImplementation((data) => {
            query.data = { ...mockProject, ...data }
            return queryBuilder
        }),

        delete: vi.fn().mockImplementation(() => {
            query.data = null
            return queryBuilder
        }),

        eq: vi.fn().mockImplementation((column, value) => {
            query._filters[column] = value
            if (column === 'id') {
                query.data = mockProjects.find(p => p.id === value) || null
            }
            return queryBuilder
        }),

        order: vi.fn().mockImplementation((column, options) => {
            query._orderBy = { column, ...options }
            return queryBuilder
        }),

        limit: vi.fn().mockImplementation((count) => {
            query._limit = count
            return queryBuilder
        }),

        single: vi.fn().mockImplementation(() => {
            if (Array.isArray(query.data)) {
                query.data = query.data[0] || null
            }
            return Promise.resolve({ data: query.data, error: query.error })
        }),

        // Este es el método que resuelve la promesa
        then: (resolve) => {
            resolve({ data: query.data, error: query.error })
        }
    }

    return queryBuilder
}

// Mock principal de Supabase
export const mockSupabase = {
    auth: mockAuthApi,
    from: vi.fn().mockImplementation((table) => {
        return createMockDbQuery()
    })
}

// Función para crear el mock del módulo
export const createSupabaseMock = () => {
    vi.mock('../../../config/supabase', () => ({
        supabase: mockSupabase
    }))
}

export default mockSupabase
