/**
 * Register Component - Formulario de registro con auto-guardado
 * 
 * Funcionalidades:
 * - Auto-guardado de username y email en localStorage (NO contraseñas)
 * - Recuperación automática de datos al cargar
 * - Indicador visual de progreso guardado
 * - Limpieza de localStorage tras registro exitoso
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../../../config'
import useLocalStorage from '../../../shared/hooks/useLocalStorage'
import {
  AcademicCapIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CloudArrowUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import '../styles/auth.css'

// Clave para localStorage del formulario de registro
const REGISTER_FORM_KEY = 'register_form_progress'

function Register() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Estados de UI
  const [success, setSuccess] = useState(false)
  const [showSavedIndicator, setShowSavedIndicator] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Hook de navegación
  const navigate = useNavigate()

  // Store de autenticación
  const { register, loading, error, clearError } = useAuthStore()

  // Hook personalizado para localStorage
  // Solo guardamos username y email (NUNCA contraseñas)
  const [savedFormData, setSavedFormData, removeSavedFormData, isSaved] = useLocalStorage(
    REGISTER_FORM_KEY,
    { username: '', email: '' }
  )

  // =====================================================
  // Efecto: Recuperar datos guardados al montar
  // =====================================================
  useEffect(() => {
    if (savedFormData && (savedFormData.username || savedFormData.email)) {
      setFormData(prev => ({
        ...prev,
        username: savedFormData.username || '',
        email: savedFormData.email || ''
      }))

      // Mostrar indicador de datos recuperados
      if (savedFormData.username || savedFormData.email) {
        setShowSavedIndicator(true)
        setTimeout(() => setShowSavedIndicator(false), 3000)
      }
    }
  }, []) // Solo al montar

  // =====================================================
  // Función: Auto-guardar con debounce
  // =====================================================
  const autoSave = useCallback((data) => {
    // Solo guardar username y email, NUNCA contraseñas
    const safeData = {
      username: data.username,
      email: data.email,
      savedAt: new Date().toISOString()
    }
    setSavedFormData(safeData)

    // Mostrar indicador visual brevemente
    setShowSavedIndicator(true)
    setTimeout(() => setShowSavedIndicator(false), 2000)
  }, [setSavedFormData])

  // =====================================================
  // Efecto: Auto-guardar cuando cambian username o email
  // =====================================================
  useEffect(() => {
    // Solo auto-guardar si hay datos
    if (formData.username || formData.email) {
      // Debounce de 500ms
      const timeoutId = setTimeout(() => {
        autoSave(formData)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [formData.username, formData.email, autoSave])

  // =====================================================
  // Función: Validar formulario
  // =====================================================
  const validateForm = useCallback(() => {
    const errors = {}

    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido'
    } else if (formData.username.length < 3) {
      errors.username = 'El usuario debe tener al menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido'
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  // =====================================================
  // Manejador: Cambio en campos
  // =====================================================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpiar error del campo específico
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }))

    clearError()
    setSuccess(false)
  }, [clearError])

  // =====================================================
  // Manejador: Limpiar formulario guardado
  // =====================================================
  const handleClearSaved = useCallback(() => {
    removeSavedFormData()
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setValidationErrors({})
  }, [removeSavedFormData])

  // =====================================================
  // Manejador: Enviar formulario
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      return
    }

    // Intentar registro
    const result = await register(formData.email, formData.password, {
      username: formData.username
    })

    if (result.success) {
      // ¡IMPORTANTE! Limpiar localStorage tras registro exitoso
      removeSavedFormData()

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Redirigir al login después de mostrar el mensaje
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 2000)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">
              <AcademicCapIcon className="h-12 w-12" />
            </span>
            <h1>Crear Cuenta</h1>
          </div>
          <p className="subtitle">Únete a la Plataforma Educativa</p>
        </div>

        {/* Indicador de progreso guardado */}
        {showSavedIndicator && isSaved && (
          <div className="saved-indicator">
            <CloudArrowUpIcon className="h-4 w-4" />
            <span>Progreso guardado</span>
          </div>
        )}

        {/* Botón para limpiar datos guardados */}
        {isSaved && (formData.username || formData.email) && !success && (
          <div className="saved-data-banner">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Datos recuperados</span>
            <button
              type="button"
              className="clear-saved-btn"
              onClick={handleClearSaved}
            >
              Limpiar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo: Usuario */}
          <div className={`form-group ${validationErrors.username ? 'has-error' : ''}`}>
            <label htmlFor="username">
              <UserIcon className="h-5 w-5 inline-block mr-2" />
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Elige tu nombre de usuario"
              autoComplete="username"
              className={validationErrors.username ? 'input-error' : ''}
            />
            {validationErrors.username && (
              <span className="field-error">{validationErrors.username}</span>
            )}
          </div>

          {/* Campo: Email */}
          <div className={`form-group ${validationErrors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">
              <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              autoComplete="email"
              className={validationErrors.email ? 'input-error' : ''}
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div className={`form-group ${validationErrors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">
              <LockClosedIcon className="h-5 w-5 inline-block mr-2" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className={validationErrors.password ? 'input-error' : ''}
            />
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className={`form-group ${validationErrors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">
              <LockClosedIcon className="h-5 w-5 inline-block mr-2" />
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              className={validationErrors.confirmPassword ? 'input-error' : ''}
            />
            {validationErrors.confirmPassword && (
              <span className="field-error">{validationErrors.confirmPassword}</span>
            )}
          </div>

          {/* Mensaje de error del servidor */}
          {error && <div className="error-message">{error}</div>}

          {/* Mensaje de éxito */}
          {success && (
            <div className="success-message">
              <CheckCircleIcon className="h-5 w-5 inline-block mr-2" />
              Cuenta creada. Por favor, verifica tu correo electrónico.
            </div>
          )}

          {/* Botón de envío */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {/* Enlaces */}
          <div className="auth-links">
            <p>¿Ya tienes cuenta?</p>
            <Link to="/login" className="auth-link">
              Inicia Sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
