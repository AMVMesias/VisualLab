import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth'
import { useProjectStore } from '../store/projectStore'
import { ROUTES, APP_CONFIG } from '../../../config'
import { ArrowLeftIcon, UserIcon, CubeIcon } from '@heroicons/react/24/outline'
import '../styles/viewer.css'

function ThreeDViewer() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getProjectState, saveProjectState } = useProjectStore()
  const iframeRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar estado guardado al montar
    if (user) {
      const savedState = getProjectState(user.id, 'viewer3d')
      if (savedState) {
        console.log('Estado de visor 3D cargado:', savedState)
      }
    }

    // Auto-guardar cada 30 segundos
    const saveInterval = setInterval(() => {
      if (user && iframeRef.current) {
        try {
          const currentState = {
            timestamp: new Date().toISOString(),
            // Aquí se puede capturar el estado del visor 3D
          }
          
          saveProjectState(user.id, 'viewer3d', currentState)
        } catch (error) {
          console.error('Error al auto-guardar:', error)
        }
      }
    }, 30000)

    return () => clearInterval(saveInterval)
  }, [user])

  const handleIframeLoad = () => {
    setIsLoading(false)
    
    if (user && iframeRef.current) {
      const savedState = getProjectState(user.id, 'viewer3d')
      if (savedState) {
        try {
          iframeRef.current.contentWindow.postMessage({
            type: 'LOAD_STATE',
            state: savedState
          }, '*')
        } catch (error) {
          console.error('Error al cargar estado en iframe:', error)
        }
      }
    }
  }

  const handleBackToDashboard = () => {
    if (user && iframeRef.current) {
      try {
        const currentState = {
          timestamp: new Date().toISOString(),
        }
        saveProjectState(user.id, 'viewer3d', currentState)
      } catch (error) {
        console.error('Error al guardar antes de salir:', error)
      }
    }
    
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="viewer-container">
      <div className="viewer-header">
        <button 
          className="back-button"
          onClick={handleBackToDashboard}
        >
          <ArrowLeftIcon className="h-5 w-5 inline-block mr-2" />
          Volver al Dashboard
        </button>
        <h2>
          <CubeIcon className="h-6 w-6 inline-block mr-2" />
          Visor 3D Interactivo
        </h2>
        <div className="user-badge">
          <UserIcon className="h-5 w-5 inline-block mr-2" />
          {user?.username}
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando visor 3D...</p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="/3d-app/index.html"
        title="3D Viewer"
        className="viewer-iframe"
        onLoad={handleIframeLoad}
      />
    </div>
  )
}

export default ThreeDViewer
