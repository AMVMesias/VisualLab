import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../../../config'
import { AcademicCapIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import '../styles/auth.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Por favor, completa todos los campos')
      return
    }
    
    const success = login(username, password)
    
    if (success) {
      navigate(ROUTES.DASHBOARD)
    } else {
      setError('Credenciales inválidas')
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
            <label htmlFor="username">
              <UserIcon className="h-5 w-5 inline-block mr-2" />
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
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
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Iniciar Sesión
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
