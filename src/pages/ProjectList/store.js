import create from 'zustand'

import RestConnector from '../../connectors/RestConnector'

const useProjectListStore = create((set, get) => ({
  isLoading: {},
  projects: [],

  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value }})),
  queryProjects: async (query='') => {
    const projectsResponse = await RestConnector.get(`projects?q=${query}`)
    const projectsObj = projectsResponse.data

    set({ projects: projectsObj })
  }
}))

export default useProjectListStore