import create from 'zustand'

import LabelClass from '../../classes/LabelClass'

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
  },

  getLabels: async (projectId) => {
    const setIsLoadingField = get().setIsLoadingField

    setIsLoadingField("labels", true)

    const labelsResponse = await RestConnector.get(`annotation_labels?project_id=${projectId}`)

    const labelsObj = labelsResponse.data.map(label => LabelClass.constructorFromServerData(label))
    set({ labels: labelsObj })

    setIsLoadingField("labels", false)
  },

  updateLabel: async (id, newLabel) => {
    debugger
    newLabel.applyUpdateLabel()
    const newLabels = get().labels.map(label => {
      if (label.id !== id) {
        return label
      } else {
        return newLabel
      }
    })

    set({ labels: newLabels })
  }
}))

export default useProjectInfoStore