/**
 * Tests unitarios para authStore
 * Prueba las funciones de autenticación: register, login, logout, resetPassword
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockUser, mockUserUnconfirmed, mockSession, resetMockAuth } from '../../mocks/supabase.mock'

// Mock de Supabase antes de importar el store
vi.mock('../../../config/supabase', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            resetPasswordForEmail: vi.fn(),
            updateUser: vi.fn(),
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockImplementation((cb) => {
                cb('INITIAL_SESSION', null)
                return { data: { subscription: { unsubscribe: vi.fn() } } }
            })
        }
    }
}))

// Importar después del mock
import { useAuthStore } from '../../../features/auth/store/authStore'

describe('authStore', () => {
    beforeEach(() => {
        // Resetear el store antes de cada test
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null
        })
        vi.clearAllMocks()
    })

    afterEach(() => {
        resetMockAuth()
    })

    describe('Estado inicial', () => {
        it('debe tener el estado inicial correcto', () => {
            const state = useAuthStore.getState()

            expect(state.user).toBeNull()
            expect(state.isAuthenticated).toBe(false)
            expect(state.loading).toBe(false)
            expect(state.error).toBeNull()
        })
    })

    describe('register', () => {
        it('debe registrar un usuario exitosamente', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.signUp.mockResolvedValueOnce({
                data: { user: mockUserUnconfirmed, session: null },
                error: null
            })
            supabase.auth.signOut.mockResolvedValueOnce({ error: null })

            const result = await useAuthStore.getState().register(
                'newuser@example.com',
                'password123',
                { username: 'newuser' }
            )

            expect(result.success).toBe(true)
            expect(result.needsVerification).toBe(true)
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'password123',
                options: { data: { username: 'newuser' } }
            })

            // No debe estar autenticado después del registro
            const state = useAuthStore.getState()
            expect(state.isAuthenticated).toBe(false)
        })

        it('debe manejar errores de registro', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.signUp.mockResolvedValueOnce({
                data: { user: null, session: null },
                error: { message: 'User already registered' }
            })

            const result = await useAuthStore.getState().register(
                'existing@example.com',
                'password123',
                {}
            )

            expect(result.success).toBe(false)
            expect(result.error).toBe('User already registered')

            const state = useAuthStore.getState()
            expect(state.error).toBe('User already registered')
            expect(state.loading).toBe(false)
        })
    })

    describe('login', () => {
        it('debe iniciar sesión exitosamente con email confirmado', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.signInWithPassword.mockResolvedValueOnce({
                data: { user: mockUser, session: mockSession },
                error: null
            })

            const result = await useAuthStore.getState().login(
                'test@example.com',
                'password123'
            )

            expect(result.success).toBe(true)
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            })

            const state = useAuthStore.getState()
            expect(state.isAuthenticated).toBe(true)
            expect(state.user).toEqual(mockUser)
        })

        it('debe rechazar login con email no confirmado', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.signInWithPassword.mockResolvedValueOnce({
                data: { user: mockUserUnconfirmed, session: mockSession },
                error: null
            })
            supabase.auth.signOut.mockResolvedValueOnce({ error: null })

            const result = await useAuthStore.getState().login(
                'unconfirmed@example.com',
                'password123'
            )

            expect(result.success).toBe(false)
            expect(result.needsVerification).toBe(true)
            expect(supabase.auth.signOut).toHaveBeenCalled()

            const state = useAuthStore.getState()
            expect(state.isAuthenticated).toBe(false)
            expect(state.error).toContain('confirmar tu correo')
        })

        it('debe manejar credenciales inválidas', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.signInWithPassword.mockResolvedValueOnce({
                data: { user: null, session: null },
                error: { message: 'Invalid login credentials' }
            })

            const result = await useAuthStore.getState().login(
                'wrong@example.com',
                'wrongpassword'
            )

            expect(result.success).toBe(false)
            expect(result.error).toBe('Invalid login credentials')

            const state = useAuthStore.getState()
            expect(state.isAuthenticated).toBe(false)
            expect(state.error).toBe('Invalid login credentials')
        })
    })

    describe('logout', () => {
        it('debe cerrar sesión exitosamente', async () => {
            const { supabase } = await import('../../../config/supabase')

            // Primero establecer usuario autenticado
            useAuthStore.setState({
                user: mockUser,
                isAuthenticated: true
            })

            supabase.auth.signOut.mockResolvedValueOnce({ error: null })

            const result = await useAuthStore.getState().logout()

            expect(result.success).toBe(true)
            expect(supabase.auth.signOut).toHaveBeenCalled()

            const state = useAuthStore.getState()
            expect(state.user).toBeNull()
            expect(state.isAuthenticated).toBe(false)
        })

        it('debe manejar errores de logout', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.signOut.mockResolvedValueOnce({
                error: { message: 'Logout failed' }
            })

            const result = await useAuthStore.getState().logout()

            expect(result.success).toBe(false)
            expect(result.error).toBe('Logout failed')
        })
    })

    describe('resetPassword', () => {
        it('debe enviar email de recuperación exitosamente', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ error: null })

            const result = await useAuthStore.getState().resetPassword('test@example.com')

            expect(result.success).toBe(true)
            expect(result.message).toContain('correo')
            expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
                'test@example.com',
                expect.any(Object)
            )
        })

        it('debe manejar errores de recuperación', async () => {
            const { supabase } = await import('../../../config/supabase')

            supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
                error: { message: 'Email not found' }
            })

            const result = await useAuthStore.getState().resetPassword('notfound@example.com')

            expect(result.success).toBe(false)
            expect(result.error).toBe('Email not found')
        })
    })

    describe('clearError', () => {
        it('debe limpiar los errores', () => {
            useAuthStore.setState({ error: 'Some error' })

            useAuthStore.getState().clearError()

            expect(useAuthStore.getState().error).toBeNull()
        })
    })
})
