/**
 * Tests unitarios para useLocalStorage hook
 * Prueba persistencia, sincronización y manejo de errores
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useLocalStorage from '../../../shared/hooks/useLocalStorage'

describe('useLocalStorage Hook', () => {
    beforeEach(() => {
        // Limpiar mocks
        localStorage.getItem.mockClear()
        localStorage.setItem.mockClear()
        localStorage.removeItem.mockClear()
    })

    describe('Inicialización', () => {
        it('debe retornar valor inicial si localStorage está vacío', () => {
            localStorage.getItem.mockReturnValueOnce(null)

            const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

            expect(result.current[0]).toBe('initial')
            expect(result.current[3]).toBe(false) // isSaved
        })

        it('debe retornar valor guardado si existe en localStorage', () => {
            localStorage.getItem.mockReturnValueOnce(JSON.stringify('saved-value'))

            const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

            expect(result.current[0]).toBe('saved-value')
            expect(result.current[3]).toBe(true) // isSaved
        })

        it('debe manejar objetos en localStorage', () => {
            const savedObject = { name: 'test', count: 42 }
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedObject))

            const { result } = renderHook(() => useLocalStorage('test-key', {}))

            expect(result.current[0]).toEqual(savedObject)
        })
    })

    describe('setValue', () => {
        it('debe actualizar el estado y localStorage', () => {
            localStorage.getItem.mockReturnValueOnce(null)

            const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

            act(() => {
                result.current[1]('new-value')
            })

            expect(result.current[0]).toBe('new-value')
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'test-key',
                JSON.stringify('new-value')
            )
            expect(result.current[3]).toBe(true) // isSaved
        })

        it('debe aceptar una función como actualizador', () => {
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(5))

            const { result } = renderHook(() => useLocalStorage('test-key', 0))

            act(() => {
                result.current[1]((prev) => prev + 1)
            })

            expect(result.current[0]).toBe(6)
        })

        it('debe actualizar objetos correctamente', () => {
            localStorage.getItem.mockReturnValueOnce(JSON.stringify({ count: 0 }))

            const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }))

            act(() => {
                result.current[1]({ count: 10 })
            })

            expect(result.current[0]).toEqual({ count: 10 })
        })
    })

    describe('removeValue', () => {
        it('debe remover el valor de localStorage', () => {
            localStorage.getItem.mockReturnValueOnce(JSON.stringify('saved'))

            const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

            act(() => {
                result.current[2]()
            })

            expect(localStorage.removeItem).toHaveBeenCalledWith('test-key')
            expect(result.current[0]).toBe('initial')
            expect(result.current[3]).toBe(false) // isSaved
        })
    })

    describe('Manejo de errores', () => {
        it('debe retornar valor inicial si JSON es inválido', () => {
            localStorage.getItem.mockReturnValueOnce('invalid-json')

            const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))

            expect(result.current[0]).toBe('fallback')
        })

        it('debe manejar errores de setItem', () => {
            localStorage.getItem.mockReturnValueOnce(null)
            localStorage.setItem.mockImplementationOnce(() => {
                throw new Error('QuotaExceededError')
            })

            const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

            act(() => {
                result.current[1]('new-value')
            })

            // No debería lanzar error
            expect(result.current[3]).toBe(false) // isSaved should be false
        })
    })

    describe('Múltiples instancias', () => {
        it('debe usar claves diferentes para diferentes hooks', () => {
            localStorage.getItem.mockReturnValue(null)

            const { result: result1 } = renderHook(() => useLocalStorage('key-1', 'value-1'))
            const { result: result2 } = renderHook(() => useLocalStorage('key-2', 'value-2'))

            expect(result1.current[0]).toBe('value-1')
            expect(result2.current[0]).toBe('value-2')
        })
    })
})
