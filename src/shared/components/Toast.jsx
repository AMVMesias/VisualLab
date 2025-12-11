/**
 * Toast Component - Sistema de notificaciones toast
 * Proporciona feedback visual al usuario
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import './Toast.css'

// Contexto para el sistema de toasts
const ToastContext = createContext(null)

/**
 * Toast Item Component
 */
function ToastItem({ id, type, message, duration, onClose }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id)
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [id, duration, onClose])

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }

    return (
        <div className={`toast toast-${type}`} role="alert">
            <span className="toast-icon">{icons[type]}</span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={() => onClose(id)} aria-label="Cerrar">
                ×
            </button>
        </div>
    )
}

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    // Agregar un toast
    const addToast = useCallback((type, message, duration = 4000) => {
        const id = Date.now() + Math.random()
        setToasts((prev) => [...prev, { id, type, message, duration }])
        return id
    }, [])

    // Remover un toast
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    // Funciones de conveniencia
    const toast = {
        success: (message, duration) => addToast('success', message, duration),
        error: (message, duration) => addToast('error', message, duration),
        warning: (message, duration) => addToast('warning', message, duration),
        info: (message, duration) => addToast('info', message, duration)
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-container" aria-live="polite">
                {toasts.map((t) => (
                    <ToastItem
                        key={t.id}
                        id={t.id}
                        type={t.type}
                        message={t.message}
                        duration={t.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

/**
 * Hook para usar toasts
 */
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast debe usarse dentro de un ToastProvider')
    }
    return context
}

export default ToastProvider
