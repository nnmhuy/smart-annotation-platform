import create from 'zustand'

import ProjectService from '../../services/ProjectService'

const useProjectListStore = create((set, get) => ({
  isLoading: {},
  projects: [],

  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value }})),
  queryProjects: async () => {
    const projects = await ProjectService.getProjects()

    set({ projects })
  },
  appendProject: (newProject) => {
    const currentProjects = [...get().projects]
    set({ projects: [...currentProjects, newProject]})
  }
}))

export default useProjectListStore