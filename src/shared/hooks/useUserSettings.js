/**
 * useUserSettings - Hook personalizado para gestionar configuraciones de usuario
 * Wrapper conveniente sobre el settingsStore con funcionalidades adicionales
 */

import { useCallback, useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

/**
 * Hook para manejar configuraciones de usuario
 * @returns {Object} - Configuraciones y funciones de manejo
 */
function useUserSettings() {
    // Obtener estado y acciones del store
    const {
        settings,
        isLoading,
        lastSaved,
        error,
        setTheme,
        setLanguage,
        setNotificationPreference,
        toggleNotification,
        setDisplayPreference,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings,
        clearError
    } = useSettingsStore()

    // =====================================================
    // Efectos
    // =====================================================

    // Aplicar tema al montar y cuando cambie
    useEffect(() => {
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme)

            // Manejar tema automático
            if (settings.theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
            }
        }
    }, [settings.theme])

    // Aplicar idioma
    useEffect(() => {
        if (settings.language) {
            document.documentElement.setAttribute('lang', settings.language)
        }
    }, [settings.language])

    // Aplicar tamaño de fuente
    useEffect(() => {
        if (settings.display?.fontSize) {
            const fontSizes = {
                small: '14px',
                medium: '16px',
                large: '18px'
            }
            document.documentElement.style.setProperty('--base-font-size', fontSizes[settings.display.fontSize])
        }
    }, [settings.display?.fontSize])

    // =====================================================
    // Funciones de conveniencia
    // =====================================================

    // Alternar tema entre claro y oscuro
    const toggleTheme = useCallback(() => {
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        return newTheme
    }, [settings.theme, setTheme])

    // Obtener tema actual resuelto (considerando 'auto')
    const getResolvedTheme = useCallback(() => {
        if (settings.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return settings.theme
    }, [settings.theme])

    // Verificar si una notificación está habilitada
    const isNotificationEnabled = useCallback((type) => {
        return settings.notifications?.[type] ?? false
    }, [settings.notifications])

    // Manejar importación desde input file
    const handleImportFromFile = useCallback(async (event) => {
        const file = event.target.files?.[0]
        if (!file) {
            return { success: false, error: 'No se seleccionó ningún archivo' }
        }
        return await importSettings(file)
    }, [importSettings])

    // Exportar con nombre personalizado
    const exportWithName = useCallback((customName) => {
        const { settings: currentSettings } = useSettingsStore.getState()

        const exportData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            appName: 'VisualLab',
            customName: customName || 'Sin nombre',
            settings: currentSettings
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${customName || 'visuallab_settings'}_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        return { success: true }
    }, [])

    // =====================================================
    // Retorno del hook
    // =====================================================

    return {
        // Estado
        settings,
        theme: settings.theme,
        language: settings.language,
        notifications: settings.notifications,
        display: settings.display,
        isLoading,
        lastSaved,
        error,

        // Acciones de tema
        setTheme,
        toggleTheme,
        getResolvedTheme,
        isDarkMode: getResolvedTheme() === 'dark',

        // Acciones de idioma
        setLanguage,

        // Acciones de notificaciones
        setNotificationPreference,
        toggleNotification,
        isNotificationEnabled,

        // Acciones de display
        setDisplayPreference,

        // Acciones generales
        updateSettings,
        resetSettings,

        // Export/Import
        exportSettings,
        exportWithName,
        importSettings,
        handleImportFromFile,

        // Utilidades
        clearError
    }
}

export default useUserSettings
