import { useState, useRef } from 'react'
import { ArrowDownTrayIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import './ImportConfigModal.css'

function ImportConfigModal({ isOpen, onClose, onImport }) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (!file.name.endsWith('.json')) {
      alert('Por favor, selecciona un archivo JSON válido')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        const success = onImport(content)
        if (success) {
          alert('✓ Configuración importada exitosamente')
          onClose()
        } else {
          alert('✗ Error al importar la configuración')
        }
      } catch (error) {
        alert('✗ Error al leer el archivo: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>
          <ArrowDownTrayIcon className="h-6 w-6 inline-block mr-2" />
          Importar Configuración
        </h2>
        <p className="modal-description">
          Importa un archivo JSON con tu configuración guardada previamente
        </p>

        <div 
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="drop-zone-icon">
            <DocumentTextIcon className="h-16 w-16" />
          </div>
          <p>Arrastra y suelta tu archivo JSON aquí</p>
          <p className="drop-zone-or">o</p>
          <button className="browse-button" onClick={handleButtonClick}>
            Examinar archivos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="info-box">
          <strong>💡 Nota:</strong> El archivo debe ser una configuración exportada 
          previamente desde esta plataforma.
        </div>
      </div>
    </div>
  )
}

export default ImportConfigModal
