import create from 'zustand'

import RestConnector from '../../connectors/RestConnector'

const useProjectListStore = create((set, get) => ({
  isLoading: {},
  projects: [],

  queryProjects: async (query='') => {
    const projectsResponse = await RestConnector.get(`projects?q=${query}`)
    const projectsObj = projectsResponse.data

    set({ projects: projectsObj })
  }
}))

export default useProjectListStore