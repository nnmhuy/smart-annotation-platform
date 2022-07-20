import create from 'zustand'
import { remove } from 'lodash'

import DatasetService from '../../services/DatasetService'
import DataInstanceService from '../../services/DataInstanceService'

const useDatasetManagementStore = create((set, get) => ({
  isLoading: {},
  dataset: {},
  dataList: [],
  selected: {},

  setIsLoadingField: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  getDataset: async (datasetId) => {
    const setIsLoadingField = get().setIsLoadingField

    setIsLoadingField("dataset", true)

    const dataset = await DatasetService.getDatasetById(datasetId)
      .catch((err) => {
        alert(err.message)
        window.history.back()
      })
    set({ dataset })

    setIsLoadingField("dataset", false)
  },
  updateDatasetInfo: async (newDataset) => {
    const updatedDataset = await DatasetService.updateDataset(newDataset)
    set({ dataset: updatedDataset })
  },

  getData: async (datasetId, page, per_page = 20) => {
    const setIsLoadingField = get().setIsLoadingField
    setIsLoadingField("dataList", true)

    const dataList = await DataInstanceService.getDataInstancesByDataset(datasetId, page, per_page)
    set({ dataList })

    setIsLoadingField("dataList", false)
  },

  setSelectedData: (id, value) => {
    const selected = get().selected
    set({ selected: { ...selected, [id]: value }})
  },
  deselectAll: () => {
    set({ selected: {} })
  },
  deleteSelectedData: async () => {
    const setIsLoadingField = get().setIsLoadingField
    setIsLoadingField("deleting", true)

    const selected = get().selected
    let dataList = [...get().dataList]

    let toDeleteData = remove(dataList, data => selected[data.id])

    await Promise.all(toDeleteData.map(img => DataInstanceService.deleteDataById(img.id)))

    set({ 
      selected: {},
      dataList,
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