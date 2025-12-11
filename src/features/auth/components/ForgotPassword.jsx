import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { AcademicCapIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import '../styles/auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { resetPassword, loading, error, clearError } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      return
    }

    const result = await resetPassword(email)
    
    if (result.success) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="login-container">
        <div className="login-background">
          <div className="geometric-shape shape-1"></div>
          <div className="geometric-shape shape-2"></div>
          <div className="geometric-shape shape-3"></div>
        </div>
        
        <div className="login-card success-card">
          <div className="success-icon">
            <CheckCircleIcon className="h-24 w-24 text-green-500" />
          </div>
          
          <h2>¡Correo Enviado!</h2>
          
          <div className="success-message">
            <p>
              Hemos enviado las instrucciones de recuperación a:
            </p>
            <p className="email-highlight">{email}</p>
            <p className="note">
              Por favor, revisa tu bandeja de entrada y sigue los pasos para recuperar tu contraseña.
            </p>
          </div>

          <Link to="/login" className="login-button">
            Volver al Login
          </Link>
        </div>
      </div>
    )
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
            <h1>Recuperar Contraseña</h1>
          </div>
          <p className="subtitle">Te enviaremos instrucciones a tu correo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError()
              }}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              ← Volver al Login
            </Link>
            <span className="separator">•</span>
            <Link to="/register" className="auth-link">
              Crear Cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
