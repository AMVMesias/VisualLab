/**
 * Tests unitarios para settingsStore
 * Prueba configuraciones de tema, idioma y notificaciones
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de localStorage para persist
vi.mock('zustand/middleware', async () => {
    const actual = await vi.importActual('zustand/middleware')
    return {
        ...actual,
        persist: (config) => (set, get, api) => config(set, get, api)
    }
})

// Importar después del mock
import { useSettingsStore } from '../../../shared/store/settingsStore'

describe('settingsStore', () => {
    beforeEach(() => {
        // Resetear el store
        useSettingsStore.setState({
            settings: {
                theme: 'dark',
                language: 'es',
                notifications: {
                    email: true,
                    push: false,
                    sounds: true,
                    desktop: false
                },
                display: {
                    compactMode: false,
                    showAnimations: true,
                    fontSize: 'medium'
                }
            },
            isLoading: false,
            lastSaved: null,
            error: null
        })
    })

    describe('Estado inicial', () => {
        it('debe tener el estado inicial correcto', () => {
            const state = useSettingsStore.getState()

            expect(state.settings.theme).toBe('dark')
            expect(state.settings.language).toBe('es')
            expect(state.settings.notifications.email).toBe(true)
            expect(state.isLoading).toBe(false)
        })
    })

    describe('Tema', () => {
        it('debe cambiar el tema', () => {
            const { setTheme } = useSettingsStore.getState()

            setTheme('light')

            const state = useSettingsStore.getState()
            expect(state.settings.theme).toBe('light')
            expect(state.lastSaved).not.toBeNull()
        })

        it('debe aceptar tema auto', () => {
            const { setTheme } = useSettingsStore.getState()

            setTheme('auto')

            expect(useSettingsStore.getState().settings.theme).toBe('auto')
        })
    })

    describe('Idioma', () => {
        it('debe cambiar el idioma', () => {
            const { setLanguage } = useSettingsStore.getState()

            setLanguage('en')

            expect(useSettingsStore.getState().settings.language).toBe('en')
        })
    })

    describe('Notificaciones', () => {
        it('debe configurar preferencia de notificación', () => {
            const { setNotificationPreference } = useSettingsStore.getState()

            setNotificationPreference('push', true)

            expect(useSettingsStore.getState().settings.notifications.push).toBe(true)
        })

        it('debe alternar notificación', () => {
            const { toggleNotification } = useSettingsStore.getState()

            // email es true inicialmente
            toggleNotification('email')

            expect(useSettingsStore.getState().settings.notifications.email).toBe(false)
        })
    })

    describe('Display', () => {
        it('debe configurar preferencia de display', () => {
            const { setDisplayPreference } = useSettingsStore.getState()

            setDisplayPreference('compactMode', true)

            expect(useSettingsStore.getState().settings.display.compactMode).toBe(true)
        })

        it('debe cambiar tamaño de fuente', () => {
            const { setDisplayPreference } = useSettingsStore.getState()

            setDisplayPreference('fontSize', 'large')

            expect(useSettingsStore.getState().settings.display.fontSize).toBe('large')
        })
    })

    describe('updateSettings', () => {
        it('debe actualizar múltiples configuraciones', () => {
            const { updateSettings } = useSettingsStore.getState()

            updateSettings({
                theme: 'light',
                language: 'pt',
                notifications: {
                    desktop: true
                }
            })

            const state = useSettingsStore.getState()
            expect(state.settings.theme).toBe('light')
            expect(state.settings.language).toBe('pt')
            expect(state.settings.notifications.desktop).toBe(true)
            // Debe mantener otros valores
            expect(state.settings.notifications.email).toBe(true)
        })
    })

    describe('resetSettings', () => {
        it('debe restablecer a valores por defecto', () => {
            const { setTheme, setLanguage, resetSettings } = useSettingsStore.getState()

            setTheme('light')
            setLanguage('en')

            resetSettings()

            const state = useSettingsStore.getState()
            expect(state.settings.theme).toBe('dark')
            expect(state.settings.language).toBe('es')
        })
    })

    describe('exportSettings', () => {
        it('debe exportar configuración como JSON', () => {
            // Mock de createObjectURL y click
            global.URL.createObjectURL = vi.fn(() => 'blob:test')
            global.URL.revokeObjectURL = vi.fn()
            document.createElement = vi.fn().mockReturnValue({
                click: vi.fn(),
                href: '',
                download: ''
            })
            document.body.appendChild = vi.fn()
            document.body.removeChild = vi.fn()

            const { exportSettings } = useSettingsStore.getState()
            const result = exportSettings()

            expect(result.success).toBe(true)
        })
    })

    describe('importSettings', () => {
        it('debe rechazar archivo no JSON por extensión', async () => {
            // Crear un mock de archivo con text() implementado
            const mockFile = {
                name: 'config.txt',
                text: vi.fn().mockResolvedValue('not json')
            }

            const { importSettings } = useSettingsStore.getState()
            const result = await importSettings(mockFile)

            expect(result.success).toBe(false)
            expect(result.error).toContain('JSON')
        })

        it('debe manejar archivo con JSON inválido', async () => {
            const mockFile = {
                name: 'config.json',
                text: vi.fn().mockResolvedValue('{ invalid json }')
            }

            const { importSettings } = useSettingsStore.getState()
            const result = await importSettings(mockFile)

            expect(result.success).toBe(false)
            expect(result.error).toContain('JSON válido')
        })

        it('debe importar configuración válida', async () => {
            const validConfig = {
                version: '1.0.0',
                settings: {
                    theme: 'light',
                    language: 'en'
                }
            }

            const mockFile = {
                name: 'config.json',
                text: vi.fn().mockResolvedValue(JSON.stringify(validConfig))
            }

            const { importSettings } = useSettingsStore.getState()
            const result = await importSettings(mockFile)

            expect(result.success).toBe(true)
            expect(useSettingsStore.getState().settings.theme).toBe('light')
        })

        it('debe validar tema inválido', async () => {
            const invalidConfig = {
                version: '1.0.0',
                settings: {
                    theme: 'invalid-theme'
                }
            }

            const mockFile = {
                name: 'config.json',
                text: vi.fn().mockResolvedValue(JSON.stringify(invalidConfig))
            }

            const { importSettings } = useSettingsStore.getState()
            const result = await importSettings(mockFile)

            expect(result.success).toBe(false)
            expect(result.error).toContain('Tema inválido')
        })
    })

    describe('clearError', () => {
        it('debe limpiar errores', () => {
            useSettingsStore.setState({ error: 'Some error' })

            useSettingsStore.getState().clearError()

            expect(useSettingsStore.getState().error).toBeNull()
        })
    })
})
