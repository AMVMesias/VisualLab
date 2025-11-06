import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth'
import { useProjectStore } from '../../viewers'
import { ImportConfigModal } from '../../../shared/components'
import { APP_CONFIG, ROUTES } from '../../../config'
import { 
  AcademicCapIcon, 
  ArrowUpTrayIcon, 
  ArrowDownTrayIcon, 
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline'
import '../styles/dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { getProjectState, exportConfig, importConfig } = useProjectStore()
  const [showImportModal, setShowImportModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const handleExportConfig = () => {
    if (!user) return
    
    const config = exportConfig(user.id)
    if (!config) {
      alert('No hay configuración para exportar')
      return
    }
    
    // Crear y descargar archivo JSON
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `config_${user.username}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = (jsonString) => {
    if (!user) return false
    return importConfig(user.id, jsonString)
  }

  const projects = APP_CONFIG.projects.map(project => ({
    ...project,
    route: project.id === 'fractals' ? ROUTES.FRACTALS : ROUTES.VIEWER_3D
  }))

  const getLastModified = (projectId) => {
    if (!user) return null
    const state = getProjectState(user.id, projectId)
    return state?.lastModified
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            <AcademicCapIcon className="h-8 w-8 inline-block mr-2" />
            Panel de Control
          </h1>
          <p className="welcome-text">Bienvenido, <strong>{user?.username}</strong></p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowImportModal(true)} className="btn-secondary">
            <ArrowUpTrayIcon className="h-5 w-5 inline-block mr-2" />
            Importar Configuración
          </button>
          <button onClick={handleExportConfig} className="btn-secondary">
            <ArrowDownTrayIcon className="h-5 w-5 inline-block mr-2" />
            Exportar Configuración
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <ArrowRightOnRectangleIcon className="h-5 w-5 inline-block mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="projects-section">
          <h2>Tus Proyectos</h2>
          <div className="projects-grid">
            {projects.map((project) => {
              const lastModified = getLastModified(project.id)
              
              return (
                <div 
                  key={project.id} 
                  className="project-card"
                  style={{ '--card-color': project.color }}
                >
                  <div className="card-header">
                    <div className="card-icon">{project.icon}</div>
                    <h3>{project.name}</h3>
                  </div>
                  
                  <p className="card-description">{project.description}</p>
                  
                  <div className="card-features">
                    <h4>Características:</h4>
                    <ul>
                      {project.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {lastModified && (
                    <div className="card-status">
                      <span className="status-badge">
                        <ChartBarIcon className="h-4 w-4 inline-block mr-1" />
                        Guardado
                      </span>
                      <span className="last-modified">
                        Última modificación: {new Date(lastModified).toLocaleString('es-ES')}
                      </span>
                    </div>
                  )}
                  
                  <button 
                    className="card-button"
                    onClick={() => navigate(project.route)}
                  >
                    {lastModified ? 'Continuar' : 'Comenzar'} →
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="info-section">
          <div className="info-card">
            <h3>
              <CloudArrowDownIcon className="h-6 w-6 inline-block mr-2" />
              Guardar Automático
            </h3>
            <p>
              Todos tus cambios se guardan automáticamente en tu navegador. 
              Puedes continuar donde lo dejaste cuando vuelvas a ingresar.
            </p>
          </div>
          <div className="info-card">
            <h3>
              <ArrowUpTrayIcon className="h-6 w-6 inline-block mr-2" />
              Exportar/Importar
            </h3>
            <p>
              Exporta tu configuración en formato JSON para respaldos o para 
              usarla en otro navegador.
            </p>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>Plataforma Educativa de Visualización Científica | {new Date().getFullYear()}</p>
      </footer>

      <ImportConfigModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportConfig}
      />
    </div>
  )
}

export default Dashboard
