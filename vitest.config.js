import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        // Entorno de prueba
        environment: 'jsdom',

        // Archivos de setup
        setupFiles: ['./src/tests/setup.js'],

        // Globales para evitar imports de vi, describe, it, expect
        globals: true,

        // Patrones de archivos de test
        include: ['src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],

        // Excluir
        exclude: ['node_modules', 'dist'],

        // Coverage
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.{js,jsx}'],
            exclude: [
                'src/tests/**',
                'src/**/*.test.{js,jsx}',
                'src/**/*.spec.{js,jsx}',
                'node_modules/**'
            ],
            // Umbrales de cobertura
            thresholds: {
                statements: 30,
                branches: 25,
                functions: 30,
                lines: 30
            }
        },

        // Timeouts
        testTimeout: 10000,
        hookTimeout: 10000,

        // Reporter
        reporters: ['verbose'],

        // Mock de módulos
        deps: {
            inline: [/@testing-library/]
        }
    }
})
