/**
 * Tests de integración para Register.jsx
 * Prueba registro exitoso, validación de campos y errores
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Register from '../../../features/auth/components/Register'

// Mock del store de autenticación
const mockRegister = vi.fn()
const mockClearError = vi.fn()

vi.mock('../../../features/auth/store/authStore', () => ({
    useAuthStore: vi.fn(() => ({
        register: mockRegister,
        loading: false,
        error: null,
        clearError: mockClearError
    }))
}))

// Mock de useLocalStorage - retorna valores por defecto
vi.mock('../../../shared/hooks/useLocalStorage', () => ({
    default: vi.fn(() => [
        { username: '', email: '' },  // savedFormData
        vi.fn(),                       // setSavedFormData
        vi.fn(),                       // removeSavedFormData
        false                          // isSaved
    ])
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
const renderRegister = () => {
    return render(
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    )
}

describe('Register Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRegister.mockReset()
        vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('Renderizado', () => {
        it('debe renderizar el formulario de registro', () => {
            renderRegister()

            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/crear cuenta/i)
            expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
            expect(screen.getAllByLabelText(/contraseña/i)).toHaveLength(2)
            expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
        })

        it('debe mostrar enlace para iniciar sesión', () => {
            renderRegister()

            expect(screen.getByText(/ya tienes cuenta/i)).toBeInTheDocument()
            expect(screen.getByText(/inicia sesión aquí/i)).toBeInTheDocument()
        })
    })

    describe('Validación de campos', () => {
        it('debe mostrar error si el usuario es muy corto', async () => {
            renderRegister()
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

            const usernameInput = screen.getByLabelText(/usuario/i)
            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInputs = screen.getAllByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /crear cuenta/i })

            await user.type(usernameInput, 'ab')  // Menos de 3 caracteres
            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInputs[0], 'password123')
            await user.type(passwordInputs[1], 'password123')
            await user.click(submitButton)

            await waitFor(() => {
                expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument()
            })
        })

        it('debe mostrar error si las contraseñas no coinciden', async () => {
            renderRegister()
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

            const usernameInput = screen.getByLabelText(/usuario/i)
            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInputs = screen.getAllByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /crear cuenta/i })

            await user.type(usernameInput, 'testuser')
            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInputs[0], 'password123')
            await user.type(passwordInputs[1], 'differentpassword')
            await user.click(submitButton)

            await waitFor(() => {
                expect(screen.getByText(/contraseñas no coinciden/i)).toBeInTheDocument()
            })
        })
    })

    describe('Registro exitoso', () => {
        it('debe llamar a register con los datos correctos', async () => {
            mockRegister.mockResolvedValueOnce({ success: true, needsVerification: true })
            renderRegister()
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

            const usernameInput = screen.getByLabelText(/usuario/i)
            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInputs = screen.getAllByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /crear cuenta/i })

            await user.type(usernameInput, 'testuser')
            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInputs[0], 'password123')
            await user.type(passwordInputs[1], 'password123')
            await user.click(submitButton)

            expect(mockRegister).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
                { username: 'testuser' }
            )
        })

        it('debe mostrar mensaje de éxito después de registro', async () => {
            mockRegister.mockResolvedValueOnce({ success: true, needsVerification: true })
            renderRegister()
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

            const usernameInput = screen.getByLabelText(/usuario/i)
            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInputs = screen.getAllByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /crear cuenta/i })

            await user.type(usernameInput, 'testuser')
            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInputs[0], 'password123')
            await user.type(passwordInputs[1], 'password123')
            await user.click(submitButton)

            await waitFor(() => {
                expect(screen.getByText(/cuenta creada/i)).toBeInTheDocument()
            })
        })

        it('debe redirigir al login después del registro', async () => {
            mockRegister.mockResolvedValueOnce({ success: true, needsVerification: true })
            renderRegister()
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

            const usernameInput = screen.getByLabelText(/usuario/i)
            const emailInput = screen.getByLabelText(/correo electrónico/i)
            const passwordInputs = screen.getAllByLabelText(/contraseña/i)
            const submitButton = screen.getByRole('button', { name: /crear cuenta/i })

            await user.type(usernameInput, 'testuser')
            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInputs[0], 'password123')
            await user.type(passwordInputs[1], 'password123')
            await user.click(submitButton)

            // Esperar el setTimeout de redirección
            vi.advanceTimersByTime(2100)

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/login')
            })
        })
    })
})
