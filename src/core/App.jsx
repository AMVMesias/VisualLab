import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, Login, Register, ForgotPassword } from '../features/auth'
import { Dashboard } from '../features/dashboard'
import { FractalViewer, ThreeDViewer } from '../features/viewers'
import { ROUTES } from '../config'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path={ROUTES.LOGIN}
          element={!isAuthenticated ? <Login /> : <Navigate to={ROUTES.DASHBOARD} />} 
        />
        <Route 
          path={ROUTES.REGISTER}
          element={!isAuthenticated ? <Register /> : <Navigate to={ROUTES.DASHBOARD} />} 
        />
        <Route 
          path={ROUTES.FORGOT_PASSWORD}
          element={!isAuthenticated ? <ForgotPassword /> : <Navigate to={ROUTES.DASHBOARD} />} 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path={ROUTES.DASHBOARD}
          element={isAuthenticated ? <Dashboard /> : <Navigate to={ROUTES.LOGIN} />} 
        />
        <Route 
          path={ROUTES.FRACTALS}
          element={isAuthenticated ? <FractalViewer /> : <Navigate to={ROUTES.LOGIN} />} 
        />
        <Route 
          path={ROUTES.VIEWER_3D}
          element={isAuthenticated ? <ThreeDViewer /> : <Navigate to={ROUTES.LOGIN} />} 
        />
        
        {/* Ruta raíz */}
        <Route 
          path={ROUTES.ROOT}
          element={<Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} />} 
        />
      </Routes>
    </Router>
  )
}

export default App
