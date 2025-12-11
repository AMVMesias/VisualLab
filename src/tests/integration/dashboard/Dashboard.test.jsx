/**
 * Tests de integración para Dashboard.jsx
 * Prueba carga de proyectos, interacciones y navegación
 * NOTA: Tests simplificados para evitar problemas de hoisting con vi.mock
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

// Mock de react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// Mock del store de autenticación
const mockLogout = vi.fn()
vi.mock('../../../features/auth', () => ({
    useAuthStore: vi.fn(() => ({
        user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { username: 'testuser' }
        },
        logout: mockLogout
    }))
}))

// Mock del store de proyectos
const mockGetProjectState = vi.fn()
const mockExportConfig = vi.fn()
const mockImportConfig = vi.fn()

vi.mock('../../../features/viewers', () => ({
    useProjectStore: vi.fn(() => ({
        getProjectState: mockGetProjectState,
        exportConfig: mockExportConfig,
        importConfig: mockImportConfig
    }))
}))

// Mock de la configuración - datos inline para evitar hoisting
vi.mock('../../../config', () => ({
    APP_CONFIG: {
        projects: [
            {
                id: 'fractals',
                name: 'FractalLab',
                description: 'Visualizador de fractales',
                icon: '∞',
                color: '#667eea',
                features: ['Mandelbrot', 'Julia'],
                route: '/fractals'
            },
            {
                id: 'viewer3d',
                name: 'Visor 3D',
                description: 'Explorador 3D',
                icon: '🎲',
                color: '#f093fb',
                features: ['Figuras 3D', 'Animaciones'],
                route: '/3d-viewer'
            }
        ]
    },
    ROUTES: {
        LOGIN: '/login',
        DASHBOARD: '/dashboard',
        FRACTALS: '/fractals',
        VIEWER_3D: '/3d-viewer'
    }
}))

// Importar después de los mocks
import Dashboard from '../../../features/dashboard/components/Dashboard'

// Wrapper para pruebas
const renderDashboard = () => {
    return render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    )
}

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetProjectState.mockReturnValue(null)
    })

    describe('Renderizado', () => {
        it('debe renderizar el header', () => {
            renderDashboard()
            expect(screen.getByText(/panel de control/i)).toBeInTheDocument()
        })

        it('debe renderizar los proyectos disponibles', () => {
            renderDashboard()
            expect(screen.getByText('FractalLab')).toBeInTheDocument()
            expect(screen.getByText('Visor 3D')).toBeInTheDocument()
        })

        it('debe mostrar las descripciones de proyectos', () => {
            renderDashboard()
            expect(screen.getByText(/visualizador de fractales/i)).toBeInTheDocument()
            expect(screen.getByText(/explorador 3d/i)).toBeInTheDocument()
        })
    })

    describe('Logout', () => {
        it('debe llamar a logout y navegar al login', async () => {
            renderDashboard()
            const user = userEvent.setup()

            const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i })
            await user.click(logoutButton)

            expect(mockLogout).toHaveBeenCalled()
            expect(mockNavigate).toHaveBeenCalledWith('/login')
        })
    })

    describe('Estado guardado', () => {
        it('debe mostrar "Continuar" si hay estado guardado', () => {
            mockGetProjectState.mockReturnValue({
                lastModified: '2024-01-01T12:00:00Z'
            })

            renderDashboard()

            expect(screen.getAllByText(/continuar/i).length).toBeGreaterThan(0)
        })

        it('debe mostrar "Comenzar" si no hay estado guardado', () => {
            mockGetProjectState.mockReturnValue(null)

            renderDashboard()

            expect(screen.getAllByText(/comenzar/i).length).toBeGreaterThan(0)
        })
    })

    describe('Exportar configuración', () => {
        it('debe mostrar alerta si no hay configuración para exportar', async () => {
            mockExportConfig.mockReturnValue(null)
            const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { })

            renderDashboard()
            const user = userEvent.setup()

            const exportButton = screen.getByRole('button', { name: /exportar configuración/i })
            await user.click(exportButton)

            expect(alertSpy).toHaveBeenCalledWith('No hay configuración para exportar')
            alertSpy.mockRestore()
        })
    })
})
