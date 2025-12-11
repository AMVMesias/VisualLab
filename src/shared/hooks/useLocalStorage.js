/**
 * Hook personalizado para manejar localStorage con React
 * Proporciona sincronización automática y manejo de errores
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage - Hook para persistir estado en localStorage
 * @param {string} key - Clave para almacenar en localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {[any, Function, Function, boolean]} - [value, setValue, removeValue, isSaved]
 */
function useLocalStorage(key, initialValue) {
    // Estado para indicar si los datos están guardados
    const [isSaved, setIsSaved] = useState(false)

    // Función para obtener el valor inicial
    const getInitialValue = useCallback(() => {
        try {
            const item = localStorage.getItem(key)
            if (item !== null) {
                setIsSaved(true)
                return JSON.parse(item)
            }
            return initialValue
        } catch (error) {
            console.error(`Error al leer localStorage key "${key}":`, error)
            return initialValue
        }
    }, [key, initialValue])

    // Estado principal
    const [storedValue, setStoredValue] = useState(getInitialValue)

    // Función para actualizar el valor
    const setValue = useCallback((value) => {
        try {
            // Permitir que value sea una función (como setState)
            const valueToStore = value instanceof Function ? value(storedValue) : value

            setStoredValue(valueToStore)

            // Guardar en localStorage
            localStorage.setItem(key, JSON.stringify(valueToStore))
            setIsSaved(true)

            // Disparar evento para sincronizar entre pestañas
            window.dispatchEvent(new StorageEvent('storage', {
                key: key,
                newValue: JSON.stringify(valueToStore)
            }))
        } catch (error) {
            console.error(`Error al guardar en localStorage key "${key}":`, error)
            setIsSaved(false)
        }
    }, [key, storedValue])

    // Función para eliminar el valor
    const removeValue = useCallback(() => {
        try {
            localStorage.removeItem(key)
            setStoredValue(initialValue)
            setIsSaved(false)
        } catch (error) {
            console.error(`Error al eliminar localStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    // Sincronizar con cambios externos (otras pestañas)
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue))
                    setIsSaved(true)
                } catch (error) {
                    console.error('Error al parsear storage event:', error)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [key])

    return [storedValue, setValue, removeValue, isSaved]
}

export default useLocalStorage
