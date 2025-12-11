import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../../../config/supabase'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Registro de nuevo usuario
      register: async (email, password, metadata = {}) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata // username, fullName, etc.
            }
          })

          if (error) throw error

          // IMPORTANTE: No marcar como autenticado hasta que verifique email
          // Cerrar sesión inmediatamente después del registro
          await supabase.auth.signOut()

          set({
            user: null,
            isAuthenticated: false,
            loading: false
          })

          return { success: true, data, needsVerification: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      // Login con email y contraseña
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) throw error

          // Verificar si el email ha sido confirmado
          if (!data.user?.email_confirmed_at) {
            // Cerrar la sesión si el email no está confirmado
            await supabase.auth.signOut()
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: 'Debes confirmar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.'
            })
            return {
              success: false,
              error: 'Email no confirmado',
              needsVerification: true
            }
          }

          set({
            user: data.user,
            isAuthenticated: true,
            loading: false
          })

          return { success: true, data }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      // Cerrar sesión
      logout: async () => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({ user: null, isAuthenticated: false, loading: false, error: null })
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      // Recuperar contraseña
      resetPassword: async (email) => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
          })

          if (error) throw error

          set({ loading: false })
          return { success: true, message: 'Revisa tu correo para restablecer tu contraseña' }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      // Actualizar contraseña (cuando el usuario está autenticado)
      updatePassword: async (newPassword) => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          })

          if (error) throw error

          set({ loading: false })
          return { success: true, message: 'Contraseña actualizada correctamente' }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      // Limpiar errores
      clearError: () => set({ error: null }),

      // Inicializar autenticación al cargar la app
      initializeAuth: async () => {
        try {
          // Obtener sesión actual
          const { data: { session } } = await supabase.auth.getSession()

          // Solo autenticar si el email está confirmado
          if (session?.user && session.user.email_confirmed_at) {
            set({
              user: session.user,
              isAuthenticated: true
            })
          } else if (session?.user && !session.user.email_confirmed_at) {
            // Si hay sesión pero email no confirmado, cerrar sesión
            await supabase.auth.signOut()
            set({
              user: null,
              isAuthenticated: false
            })
          }

          // Listener para cambios de autenticación
          supabase.auth.onAuthStateChange(async (_event, session) => {
            // Solo autenticar si el email está confirmado
            if (session?.user && session.user.email_confirmed_at) {
              set({
                user: session.user,
                isAuthenticated: true
              })
            } else {
              set({
                user: null,
                isAuthenticated: false
              })
            }
          })
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ error: error.message })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Inicializar autenticación al cargar el módulo
useAuthStore.getState().initializeAuth()
