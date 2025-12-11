/**
 * Tests de integración para Login.jsx
 * Prueba renderizado, validación, manejo de errores y navegación
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../../../features/auth/components/Login'

// Mock del store de autenticación
const mockLogin = vi.fn()
const mockClearError = vi.fn()
let mockLoading = false
let mockError = null

vi.mock('../../../features/auth/store/authStore', () => ({
    useAuthStore: vi.fn(() => ({
        login: mockLogin,
        loading: mockLoading,
        error: mockError,
        clearError: mockClearError
    }))
}))

// Mock de react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// Wrapper para pruebas
const renderLogin = () => {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    )
}

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLogin.mockReset()
        mockLoading = false
        mockError = null
    })

    describe('Renderizado', () => {
        it('debe renderizar el formulario de login', () => {
            renderLogin()

            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
            expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
        })

        it('debe mostrar enlaces de registro y recuperación', () => {
            renderLogin()

            expect(screen.getByText(/crear una cuenta/i)).toBeInTheDocument()
            expect(screen.getByText(/olvidaste tu contraseña/i)).toBeInTheDocument()
        })
    })

    describe('Validación de campos', () => {
        it('debe tener input de tipo email', () => {
            renderLogin()
            const emailInput = screen.getByLabelText(/correo electrónico/i)
            expect(emailInput).toHaveAttribute('type', 'email')
        })

        it('debe tener input de tipo password', () => {
            renderLogin()
            const passwordInput = screen.getByLabelText(/contraseña/i)
            expect(passwordInput).toHaveAttribute('type', 'password')
        })
    })

    describe('Interacción con formulario', () => {
        it('debe actualizar campos al escribir', async () => {
            renderLogin()
            const user = userEvent.setup()

            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInput = screen.getByLabelText(/contraseña/i)

            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInput, 'password123')

            expect(emailInput).toHaveValue('test@example.com')
            expect(passwordInput).toHaveValue('password123')
        })

        it('debe llamar a login al enviar el formulario', async () => {
            mockLogin.mockResolvedValueOnce({ success: true })
            renderLogin()
            const user = userEvent.setup()

            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInput = screen.getByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInput, 'password123')
            await user.click(submitButton)

            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
        })

        it('debe navegar al dashboard después de login exitoso', async () => {
            mockLogin.mockResolvedValueOnce({ success: true })
            renderLogin()
            const user = userEvent.setup()

            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInput = screen.getByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInput, 'password123')
            await user.click(submitButton)

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
            })
        })

        it('no debe navegar si el login falla', async () => {
            mockLogin.mockResolvedValueOnce({ success: false, error: 'Invalid credentials' })
            renderLogin()
            const user = userEvent.setup()

            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInput = screen.getByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

            await user.type(emailInput, 'wrong@example.com')
            await user.type(passwordInput, 'wrongpassword')
            await user.click(submitButton)

            expect(mockNavigate).not.toHaveBeenCalled()
        })
    })
})
