import create from 'zustand'

import RestConnector from '../../connectors/RestConnector'
import DatasetService from '../../services/DatasetService'
import ImageService from '../../services/ImageService'

const useDatasetManagementStore = create((set, get) => ({
  isLoading: {},
  dataset: {},
  images: [],

  setIsLoadingField: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  getDataset: async (datasetId) => {
    const setIsLoadingField = get().setIsLoadingField

    setIsLoadingField("dataset", true)

    const dataset = await DatasetService.getDatasetById(datasetId)
    set({ dataset })

    setIsLoadingField("dataset", false)
  },
  getImages: async (datasetId, page) => {
    const setIsLoadingField = get().setIsLoadingField
    setIsLoadingField("images", true)

    const images = await ImageService.getImagesByDataset(datasetId)
    set({ images })

    setIsLoadingField("images", false)
  }
}))

export default useDatasetManagementStore