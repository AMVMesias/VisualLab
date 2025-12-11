import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../../../config'
import { AcademicCapIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import '../styles/auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login, loading, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }
    
    const result = await login(email, password)
    
    if (result.success) {
      navigate(ROUTES.DASHBOARD)
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
            <h1>Plataforma Educativa</h1>
          </div>
          <p className="subtitle">Visualizadores Interactivos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <UserIcon className="h-5 w-5 inline-block mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="divider">
            <span>o</span>
          </div>

          <Link to="/register" className="register-link">
            Crear una cuenta nueva
          </Link>
        </form>
        
        <div className="login-footer">
          <p>Plataforma de Visualización Científica</p>
          <p className="version">v1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Login
