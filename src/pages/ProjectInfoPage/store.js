import create from 'zustand'

import RestConnector from '../../connectors/RestConnector'

const useProjectInfoStore = create((set, get) => ({
  isLoading: {},
  project: {},
  datasets: [],
  labels: [],

  setIsLoadingField: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),
  getProjectInfo: async (projectId) => {
    const setIsLoadingField = get().setIsLoadingField
    setIsLoadingField("project", true)

    const projectResponse = await RestConnector.get(`projects?id=${projectId}`)

    const projectObj = projectResponse.data[0]
    if (!projectObj) {
      alert("Not found project!")
      return;
    } else {
      set({ project: projectObj })
    }
    setIsLoadingField("project", false)
  },
  
  getDatasets: async (projectId) => {
    const setIsLoadingField = get().setIsLoadingField

    setIsLoadingField("datasets", true)

    const datasetsResponse = await RestConnector.get(`datasets?project_id=${projectId}`)

    const datasetsObj = datasetsResponse.data
    set({ datasets: datasetsObj })

    setIsLoadingField("datasets", false)
  }
}))

export default useProjectInfoStore