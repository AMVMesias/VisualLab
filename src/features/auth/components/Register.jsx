import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AcademicCapIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import '../styles/auth.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    // Por ahora solo mostramos mensaje - funcionalidad pendiente
    alert('🚧 Función en desarrollo\n\nEsta característica estará disponible próximamente.\n\nPor ahora, puedes usar uno de los usuarios de prueba:\n• estudiante1 / demo123\n• profesor1 / profesor123\n• admin / admin123')
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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
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
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="development-notice">
            <span>🚧</span>
            <p>Función en desarrollo. Usa un usuario de prueba para continuar.</p>
          </div>

          <button type="submit" className="login-button">
            Crear Cuenta
          </button>

          <div className="auth-links">
            <p>¿Ya tienes cuenta?</p>
            <Link to="/login" className="auth-link">
              Inicia Sesión aquí
            </Link>
          </div>
        </form>

        <div className="test-users-info">
          <h4>👥 Usuarios de Prueba:</h4>
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

export default Register
