/**
 * Settings Store - Manejo de configuraciones de usuario con Zustand
 * Incluye tema, idioma, preferencias de notificaciones y funciones de exportar/importar
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Configuración por defecto
const DEFAULT_SETTINGS = {
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
        fontSize: 'medium' // small, medium, large
    }
}

// Esquema de validación para configuraciones importadas
const validateSettings = (settings) => {
    const errors = []

    // Validar tema
    if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
        errors.push('Tema inválido. Debe ser: light, dark o auto')
    }

    // Validar idioma
    if (settings.language && !['es', 'en', 'pt'].includes(settings.language)) {
        errors.push('Idioma inválido. Debe ser: es, en o pt')
    }

    // Validar notificaciones
    if (settings.notifications) {
        const validNotifKeys = ['email', 'push', 'sounds', 'desktop']
        for (const key of Object.keys(settings.notifications)) {
            if (!validNotifKeys.includes(key)) {
                errors.push(`Clave de notificación inválida: ${key}`)
            }
            if (typeof settings.notifications[key] !== 'boolean') {
                errors.push(`El valor de ${key} debe ser booleano`)
            }
        }
    }

    // Validar display
    if (settings.display) {
        if (settings.display.fontSize && !['small', 'medium', 'large'].includes(settings.display.fontSize)) {
            errors.push('Tamaño de fuente inválido. Debe ser: small, medium o large')
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            // Estado de configuración
            settings: { ...DEFAULT_SETTINGS },

            // Estado de UI
            isLoading: false,
            lastSaved: null,
            error: null,

            // =====================================================
            // Acciones de Tema
            // =====================================================

            setTheme: (theme) => {
                set((state) => ({
                    settings: { ...state.settings, theme },
                    lastSaved: new Date().toISOString()
                }))
                // Aplicar tema al documento
                document.documentElement.setAttribute('data-theme', theme)
            },

            // =====================================================
            // Acciones de Idioma
            // =====================================================

            setLanguage: (language) => {
                set((state) => ({
                    settings: { ...state.settings, language },
                    lastSaved: new Date().toISOString()
                }))
                document.documentElement.setAttribute('lang', language)
            },

            // =====================================================
            // Acciones de Notificaciones
            // =====================================================

            setNotificationPreference: (key, value) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        notifications: {
                            ...state.settings.notifications,
                            [key]: value
                        }
                    },
                    lastSaved: new Date().toISOString()
                }))
            },

            toggleNotification: (key) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        notifications: {
                            ...state.settings.notifications,
                            [key]: !state.settings.notifications[key]
                        }
                    },
                    lastSaved: new Date().toISOString()
                }))
            },

            // =====================================================
            // Acciones de Display
            // =====================================================

            setDisplayPreference: (key, value) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        display: {
                            ...state.settings.display,
                            [key]: value
                        }
                    },
                    lastSaved: new Date().toISOString()
                }))
            },

            // =====================================================
            // Actualización Masiva de Configuraciones
            // =====================================================

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        ...newSettings,
                        notifications: {
                            ...state.settings.notifications,
                            ...(newSettings.notifications || {})
                        },
                        display: {
                            ...state.settings.display,
                            ...(newSettings.display || {})
                        }
                    },
                    lastSaved: new Date().toISOString()
                }))
            },

            // =====================================================
            // Restablecer Configuraciones
            // =====================================================

            resetSettings: () => {
                set({
                    settings: { ...DEFAULT_SETTINGS },
                    lastSaved: new Date().toISOString(),
                    error: null
                })
            },

            // =====================================================
            // Exportar Configuraciones
            // =====================================================

            exportSettings: () => {
                try {
                    const { settings } = get()

                    const exportData = {
                        version: '1.0.0',
                        exportDate: new Date().toISOString(),
                        appName: 'VisualLab',
                        settings: settings
                    }

                    // Crear blob y descargar
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                        type: 'application/json'
                    })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `visuallab_settings_${new Date().toISOString().split('T')[0]}.json`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)

                    return { success: true, message: 'Configuración exportada correctamente' }
                } catch (error) {
                    set({ error: error.message })
                    return { success: false, error: error.message }
                }
            },

            // =====================================================
            // Importar Configuraciones
            // =====================================================

            importSettings: async (file) => {
                set({ isLoading: true, error: null })

                try {
                    // Validar que es un archivo JSON
                    if (!file.name.endsWith('.json')) {
                        throw new Error('El archivo debe ser de tipo JSON')
                    }

                    // Leer archivo
                    const text = await file.text()
                    let importedData

                    try {
                        importedData = JSON.parse(text)
                    } catch {
                        throw new Error('El archivo no contiene JSON válido')
                    }

                    // Validar estructura básica
                    if (!importedData.settings) {
                        throw new Error('El archivo no contiene configuraciones válidas')
                    }

                    // Validar versión (para compatibilidad futura)
                    if (importedData.version && !importedData.version.startsWith('1.')) {
                        throw new Error('Versión de configuración no compatible')
                    }

                    // Validar configuraciones
                    const validation = validateSettings(importedData.settings)
                    if (!validation.isValid) {
                        throw new Error(`Configuración inválida: ${validation.errors.join(', ')}`)
                    }

                    // Aplicar configuraciones
                    get().updateSettings(importedData.settings)

                    set({ isLoading: false })
                    return {
                        success: true,
                        message: 'Configuración importada correctamente',
                        importedFrom: importedData.exportDate
                    }
                } catch (error) {
                    set({ isLoading: false, error: error.message })
                    return { success: false, error: error.message }
                }
            },

            // =====================================================
            // Limpiar errores
            // =====================================================

            clearError: () => set({ error: null })
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                settings: state.settings,
                lastSaved: state.lastSaved
            })
        }
    )
)

// Inicializar tema al cargar
const initializeTheme = () => {
    const savedSettings = JSON.parse(localStorage.getItem('settings-storage') || '{}')
    const theme = savedSettings?.state?.settings?.theme || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
}

// Ejecutar al cargar el módulo
if (typeof window !== 'undefined') {
    initializeTheme()
}

export default useSettingsStore
