import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth'
import { useProjectStore } from '../store/projectStore'
import { ROUTES, APP_CONFIG } from '../../../config'
import { ArrowLeftIcon, UserIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'
import '../styles/viewer.css'

function FractalViewer() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getProjectState, saveProjectState } = useProjectStore()
  const iframeRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar estado guardado al montar
    if (user) {
      const savedState = getProjectState(user.id, 'fractals')
      if (savedState) {
        console.log('Estado de fractales cargado:', savedState)
      }
    }

    // Auto-guardar cada 30 segundos
    const saveInterval = setInterval(() => {
      if (user && iframeRef.current) {
        try {
          // Intentar obtener el estado del iframe
          const iframeWindow = iframeRef.current.contentWindow
          
          // Aquí puedes capturar el estado del proyecto de fractales
          // Por ejemplo, enviando un mensaje al iframe para que devuelva su estado
          const currentState = {
            // Esto debería ser el estado real del proyecto de fractales
            timestamp: new Date().toISOString(),
            // Agregar más datos según sea necesario
          }
          
          saveProjectState(user.id, 'fractals', currentState)
        } catch (error) {
          console.error('Error al auto-guardar:', error)
        }
      }
    }, 30000) // 30 segundos

    return () => clearInterval(saveInterval)
  }, [user])

  const handleIframeLoad = () => {
    setIsLoading(false)
    
    // Cargar estado guardado en el iframe
    if (user && iframeRef.current) {
      const savedState = getProjectState(user.id, 'fractals')
      if (savedState) {
        // Enviar estado al iframe
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
    // Guardar estado antes de salir
    if (user && iframeRef.current) {
      try {
        const currentState = {
          timestamp: new Date().toISOString(),
        }
        saveProjectState(user.id, 'fractals', currentState)
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
          <Square3Stack3DIcon className="h-6 w-6 inline-block mr-2" />
          FractalLab
        </h2>
        <div className="user-badge">
          <UserIcon className="h-5 w-5 inline-block mr-2" />
          {user?.username}
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando visualizador de fractales...</p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="/fractals-app/index.html"
        title="Fractal Viewer"
        className="viewer-iframe"
        onLoad={handleIframeLoad}
      />
    </div>
  )
}

export default FractalViewer
