import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AcademicCapIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import '../styles/auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico')
      return
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido')
      return
    }

    // Por ahora solo mostramos mensaje - funcionalidad pendiente
    setSubmitted(true)
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

          <div className="development-notice">
            <span>🚧</span>
            <p>Esta es una plantilla de demostración. La funcionalidad real estará disponible próximamente.</p>
          </div>

          <Link to="/login" className="login-button">
            Volver al Login
          </Link>

          <div className="test-users-reminder">
            <h4>👥 Recuerda que puedes usar:</h4>
            <ul>
              <li>estudiante1 / demo123</li>
              <li>profesor1 / profesor123</li>
              <li>admin / admin123</li>
            </ul>
          </div>
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
                setError('')
              }}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="development-notice">
            <span>🚧</span>
            <p>Función en desarrollo. Usa un usuario de prueba para continuar.</p>
          </div>

          <button type="submit" className="login-button">
            Enviar Instrucciones
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

        <div className="test-users-info">
          <h4>👥 Usuarios de Prueba Disponibles:</h4>
          <ul>
            <li><strong>estudiante1</strong> / demo123</li>
            <li><strong>profesor1</strong> / profesor123</li>
            <li><strong>admin</strong> / admin123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
