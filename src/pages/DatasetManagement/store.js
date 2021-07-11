import create from 'zustand'
import { remove } from 'lodash'

import DatasetService from '../../services/DatasetService'
import ImageService from '../../services/ImageService'

const useDatasetManagementStore = create((set, get) => ({
  isLoading: {},
  dataset: {},
  images: [],
  selected: {},

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

    const images = await ImageService.getImagesByDataset(datasetId, page)
    set({ images })

    setIsLoadingField("images", false)
  },

  setSelectedImage: (id, value) => {
    const selected = get().selected
    set({ selected: { ...selected, [id]: value }})
  },
  deselectAll: () => {
    set({ selected: {} })
  },
  deleteSelectedImages: async () => {
    const setIsLoadingField = get().setIsLoadingField
    setIsLoadingField("deleting", true)

    const selected = get().selected
    let images = [...get().images]

    let toDeleteImages = remove(images, img => selected[img.id])

    await Promise.all(toDeleteImages.map(img => ImageService.deleteImageById(img.id)))

    set({ 
      selected: {},
      images,
    })
    setIsLoadingField("deleting", false)
  },

  deleteDataset: async (datasetId) => {
    const setIsLoadingField = get().setIsLoadingField
    setIsLoadingField("deleting-dataset", true)
    
    await DatasetService.deleteDatasetById(datasetId)
      .catch(err => {
        alert(get(err, 'data.errors[0]', 'Error'))
      })
    
    setIsLoadingField("deleting-dataset", false)
  }
}))

export default useDatasetManagementStore