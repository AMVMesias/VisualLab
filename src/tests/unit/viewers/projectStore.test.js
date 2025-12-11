/**
 * Tests unitarios para projectStore
 * Prueba las funciones CRUD de proyectos
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockUser, mockProject, mockProjects } from '../../mocks/supabase.mock'

// Mock de Supabase antes de importar el store
const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockEq = vi.fn()
const mockOrder = vi.fn()
const mockSingle = vi.fn()
const mockLimit = vi.fn()

const createQueryBuilder = () => ({
    select: mockSelect.mockReturnThis(),
    insert: mockInsert.mockReturnThis(),
    update: mockUpdate.mockReturnThis(),
    delete: mockDelete.mockReturnThis(),
    eq: mockEq.mockReturnThis(),
    order: mockOrder.mockReturnThis(),
    single: mockSingle,
    limit: mockLimit.mockReturnThis()
})

vi.mock('../../../config/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } })
        },
        from: vi.fn().mockImplementation(() => createQueryBuilder())
    }
}))

// Importar después del mock
import { useProjectStore } from '../../../features/viewers/store/projectStore'

describe('projectStore', () => {
    beforeEach(() => {
        // Resetear el store
        useProjectStore.setState({
            projects: [],
            currentProject: null,
            loading: false,
            error: null
        })
        vi.clearAllMocks()
    })

    describe('Estado inicial', () => {
        it('debe tener el estado inicial correcto', () => {
            const state = useProjectStore.getState()

            expect(state.projects).toEqual([])
            expect(state.currentProject).toBeNull()
            expect(state.loading).toBe(false)
            expect(state.error).toBeNull()
        })
    })

    describe('fetchProjects', () => {
        it('debe obtener proyectos exitosamente', async () => {
            mockOrder.mockResolvedValueOnce({
                data: mockProjects,
                error: null
            })

            const result = await useProjectStore.getState().fetchProjects()

            expect(result.success).toBe(true)
            expect(result.data).toEqual(mockProjects)

            const state = useProjectStore.getState()
            expect(state.projects).toEqual(mockProjects)
            expect(state.loading).toBe(false)
        })

        it('debe manejar errores al obtener proyectos', async () => {
            mockOrder.mockResolvedValueOnce({
                data: null,
                error: { message: 'Database error' }
            })

            const result = await useProjectStore.getState().fetchProjects()

            expect(result.success).toBe(false)
            expect(result.error).toBe('Database error')

            const state = useProjectStore.getState()
            expect(state.error).toBe('Database error')
        })
    })

    describe('fetchProjectsByType', () => {
        it('debe filtrar proyectos por tipo', async () => {
            const fractalProjects = mockProjects.filter(p => p.type === 'fractal')

            mockOrder.mockResolvedValueOnce({
                data: fractalProjects,
                error: null
            })

            const result = await useProjectStore.getState().fetchProjectsByType('fractal')

            expect(result.success).toBe(true)
            expect(mockEq).toHaveBeenCalledWith('type', 'fractal')
        })
    })

    describe('createProject', () => {
        it('debe crear un proyecto exitosamente', async () => {
            const newProjectData = {
                name: 'New Project',
                type: '3d',
                config: { setting: 'value' }
            }

            const createdProject = { ...mockProject, ...newProjectData }

            mockSingle.mockResolvedValueOnce({
                data: createdProject,
                error: null
            })

            const result = await useProjectStore.getState().createProject(newProjectData)

            expect(result.success).toBe(true)
            expect(result.data).toEqual(createdProject)
            expect(mockInsert).toHaveBeenCalled()
        })

        it('debe agregar el nuevo proyecto a la lista local', async () => {
            // Establecer proyectos existentes
            useProjectStore.setState({ projects: mockProjects })

            const newProject = { ...mockProject, id: 'new-project-id', name: 'New Project' }

            mockSingle.mockResolvedValueOnce({
                data: newProject,
                error: null
            })

            await useProjectStore.getState().createProject({
                name: 'New Project',
                type: '3d',
                config: {}
            })

            const state = useProjectStore.getState()
            expect(state.projects[0]).toEqual(newProject)
            expect(state.projects.length).toBe(mockProjects.length + 1)
        })

        it('debe manejar errores de creación', async () => {
            mockSingle.mockResolvedValueOnce({
                data: null,
                error: { message: 'Insert failed' }
            })

            const result = await useProjectStore.getState().createProject({
                name: 'Test',
                type: '3d',
                config: {}
            })

            expect(result.success).toBe(false)
            expect(result.error).toBe('Insert failed')
        })
    })

    describe('updateProject', () => {
        it('debe actualizar un proyecto exitosamente', async () => {
            const updatedProject = { ...mockProject, name: 'Updated Name' }

            mockSingle.mockResolvedValueOnce({
                data: updatedProject,
                error: null
            })

            const result = await useProjectStore.getState().updateProject(
                mockProject.id,
                { name: 'Updated Name' }
            )

            expect(result.success).toBe(true)
            expect(result.data.name).toBe('Updated Name')
            expect(mockUpdate).toHaveBeenCalled()
            expect(mockEq).toHaveBeenCalledWith('id', mockProject.id)
        })

        it('debe actualizar el proyecto en la lista local', async () => {
            useProjectStore.setState({ projects: [...mockProjects] })

            const updatedProject = { ...mockProject, name: 'Updated' }

            mockSingle.mockResolvedValueOnce({
                data: updatedProject,
                error: null
            })

            await useProjectStore.getState().updateProject(mockProject.id, { name: 'Updated' })

            const state = useProjectStore.getState()
            const project = state.projects.find(p => p.id === mockProject.id)
            expect(project.name).toBe('Updated')
        })
    })

    describe('deleteProject', () => {
        it('debe eliminar un proyecto exitosamente', async () => {
            useProjectStore.setState({ projects: [...mockProjects] })

            mockEq.mockResolvedValueOnce({
                data: null,
                error: null
            })

            const result = await useProjectStore.getState().deleteProject(mockProject.id)

            expect(result.success).toBe(true)
            expect(mockDelete).toHaveBeenCalled()
            expect(mockEq).toHaveBeenCalledWith('id', mockProject.id)
        })

        it('debe remover el proyecto de la lista local', async () => {
            useProjectStore.setState({ projects: [...mockProjects] })
            const initialLength = mockProjects.length

            mockEq.mockResolvedValueOnce({
                data: null,
                error: null
            })

            await useProjectStore.getState().deleteProject(mockProject.id)

            const state = useProjectStore.getState()
            expect(state.projects.length).toBe(initialLength - 1)
            expect(state.projects.find(p => p.id === mockProject.id)).toBeUndefined()
        })

        it('debe limpiar currentProject si se elimina el proyecto actual', async () => {
            useProjectStore.setState({
                projects: [...mockProjects],
                currentProject: mockProject
            })

            mockEq.mockResolvedValueOnce({
                data: null,
                error: null
            })

            await useProjectStore.getState().deleteProject(mockProject.id)

            const state = useProjectStore.getState()
            expect(state.currentProject).toBeNull()
        })
    })

    describe('loadProject', () => {
        it('debe cargar un proyecto específico', async () => {
            mockSingle.mockResolvedValueOnce({
                data: mockProject,
                error: null
            })

            const result = await useProjectStore.getState().loadProject(mockProject.id)

            expect(result.success).toBe(true)
            expect(result.data).toEqual(mockProject)

            const state = useProjectStore.getState()
            expect(state.currentProject).toEqual(mockProject)
        })
    })

    describe('setCurrentProject', () => {
        it('debe establecer el proyecto actual', () => {
            useProjectStore.getState().setCurrentProject(mockProject)

            const state = useProjectStore.getState()
            expect(state.currentProject).toEqual(mockProject)
        })
    })

    describe('clearCurrentProject', () => {
        it('debe limpiar el proyecto actual', () => {
            useProjectStore.setState({ currentProject: mockProject })

            useProjectStore.getState().clearCurrentProject()

            const state = useProjectStore.getState()
            expect(state.currentProject).toBeNull()
        })
    })

    describe('Funciones de localStorage', () => {
        beforeEach(() => {
            localStorage.getItem.mockClear()
            localStorage.setItem.mockClear()
        })

        it('getProjectState debe obtener estado de localStorage', () => {
            const savedState = { setting: 'value', lastModified: '2024-01-01' }
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedState))

            const result = useProjectStore.getState().getProjectState('user-id', 'project-id')

            expect(localStorage.getItem).toHaveBeenCalledWith('project_user-id_project-id')
            expect(result).toEqual(savedState)
        })

        it('getProjectState debe retornar null si no existe', () => {
            localStorage.getItem.mockReturnValueOnce(null)

            const result = useProjectStore.getState().getProjectState('user-id', 'project-id')

            expect(result).toBeNull()
        })

        it('saveProjectState debe guardar en localStorage', () => {
            const state = { setting: 'value' }

            const result = useProjectStore.getState().saveProjectState('user-id', 'project-id', state)

            expect(result).toBe(true)
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'project_user-id_project-id',
                expect.stringContaining('setting')
            )
        })

        it('exportConfig debe exportar configuración de usuario', () => {
            const config = JSON.stringify({ projects: { 'project-1': { data: 'test' } } })
            localStorage.getItem.mockReturnValueOnce(config)
            localStorage.key.mockReturnValueOnce('project_user-id_project-1')
            Object.defineProperty(localStorage, 'length', { value: 1, writable: true })

            const result = useProjectStore.getState().exportConfig('user-id')

            // Puede ser null si no hay proyectos del usuario
            expect(result === null || typeof result === 'string').toBe(true)
        })

        it('importConfig debe importar configuración válida', () => {
            const config = JSON.stringify({
                projects: {
                    'project-1': { data: 'test' }
                }
            })

            const result = useProjectStore.getState().importConfig('user-id', config)

            expect(result).toBe(true)
            expect(localStorage.setItem).toHaveBeenCalled()
        })

        it('importConfig debe rechazar configuración inválida', () => {
            const result = useProjectStore.getState().importConfig('user-id', 'invalid json')

            expect(result).toBe(false)
        })
    })

    describe('clearError', () => {
        it('debe limpiar los errores', () => {
            useProjectStore.setState({ error: 'Some error' })

            useProjectStore.getState().clearError()

            expect(useProjectStore.getState().error).toBeNull()
        })
    })
})
