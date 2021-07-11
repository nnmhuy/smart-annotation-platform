import create from 'zustand'

import RestConnector from '../../connectors/RestConnector'

const useProjectListStore = create((set, get) => ({
  isLoading: {},
  projects: [],

  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value }})),
  queryProjects: async (query='') => {
    const projectsResponse = await RestConnector.get(`/projects?q=${query}`)
    const projectsObj = projectsResponse.data

    set({ projects: projectsObj })
  },
  appendProject: (newProject) => {
    const currentProjects = [...get().projects]
    set({ projects: [...currentProjects, newProject]})
  }
}))

export default useProjectListStore