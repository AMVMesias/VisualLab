import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../../../config'
import { AcademicCapIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import '../styles/auth.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    clearError()
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return
    }

    if (formData.password !== formData.confirmPassword) {
      return
    }

    if (formData.password.length < 8) {
      return
    }

    const result = await register(formData.email, formData.password, {
      username: formData.username
    })

    if (result.success) {
      // Mostrar mensaje de éxito y redirigir al login
      setSuccess(true)
      // Esperar un momento para que el usuario vea el mensaje
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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
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
            />
          </div>

          <div className="form-group">
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
            />
          </div>

          <div className="form-group">
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
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
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
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {success && (
            <div className="success-message">
               Cuenta creada. Por favor, verifica tu correo electrónico.
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

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
