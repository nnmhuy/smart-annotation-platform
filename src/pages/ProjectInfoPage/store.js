import create from 'zustand'
import { filter } from 'lodash'

import ProjectService from '../../services/ProjectService'

import DatasetClass from '../../classes/DatasetClass'
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

    const projectResponse = await RestConnector.get(`/projects?id=${projectId}`)

    const projectObj = projectResponse.data[0]
    if (!projectObj) {
      alert("Not found project!")
      window.history.back()
    } else {
      set({ project: projectObj })
    }
    setIsLoadingField("project", false)
  },
  deleteProject: async () => {
    const setIsLoadingField = get().setIsLoadingField
    
    setIsLoadingField("deleting-project", true)

    const project = get().project

    await ProjectService.deleteProjectById(project.id)
      .catch(err => {
        alert(get(err, 'data.errors[0]', 'Error'))
      })

    setIsLoadingField("deleting-project", false)
  },

  getDatasets: async (projectId) => {
    const setIsLoadingField = get().setIsLoadingField

    setIsLoadingField("datasets", true)

    const datasetsResponse = await RestConnector.get(`/datasets?project_id=${projectId}`)
    const datasetsObj = datasetsResponse.data.map(dataset => DatasetClass.constructorFromServerData(dataset))
  
    set({ datasets: datasetsObj })

    setIsLoadingField("datasets", false)
  },

  appendNewDataset: (newDataset) => {
    const currentDatasets = get().datasets
    set({
      datasets: [...currentDatasets, newDataset]
    })
  },

  getLabels: async (projectId) => {
    const setIsLoadingField = get().setIsLoadingField

    setIsLoadingField("labels", true)

    const labelsResponse = await RestConnector.get(`/annotation_labels?project_id=${projectId}`)

    const labelsObj = labelsResponse.data.map(label => LabelClass.constructorFromServerData(label))
    set({ labels: labelsObj })

    setIsLoadingField("labels", false)
  },

  createLabel: async(newLabel) => {
    const createLabelResponse = await newLabel.applyCreateLabel()
    const newLabelObj = LabelClass.constructorFromServerData(createLabelResponse.data)

    const currentLabels = get().labels
    set({
      labels: [...currentLabels, newLabelObj]
    })
  },

  updateLabel: async (newLabel) => {
    newLabel.applyUpdateLabel()
    const newLabels = get().labels.map(label => {
      if (label.id !== newLabel.id) {
        return label
      } else {
        return newLabel
      }
    })

    set({ labels: newLabels })
  },

  deleteLabel: async (deleteLabel) => {
    deleteLabel.applyDeleteLabel()
    const currentLabels = get().labels
    const newLabels = filter(currentLabels, (label) => label.id !== deleteLabel.id)

    set({ labels: newLabels })
  }
}))

export default useProjectInfoStore