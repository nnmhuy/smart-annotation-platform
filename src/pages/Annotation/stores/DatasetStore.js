import create from 'zustand'

import DatasetService from '../../../services/DatasetService'
import DataInstanceService from '../../../services/DataInstanceService'


const useDatasetStore = create((set, get) => ({
  dataset: {},
  instanceId: null,
  dataInstances: [],
  isLoading: {},

  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  setInstanceId: (id) => set({ instanceId: id }),

  getDatasetInfo: async (datasetId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_dataset_info", true)

    // load dataset
    const dataset = await DatasetService.getDatasetById(datasetId)

    set({ dataset })
    setIsLoading("loading_dataset_info", false)
  },

  getDataInstances: async (datasetId, page = 1) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_data_instances", true)

    const dataInstancesObj = await DataInstanceService.getDataInstancesByDataset(datasetId, page)

    set({ dataInstances: dataInstancesObj })

    setIsLoading("loading_data_instances", false)
  },
}))

export default useDatasetStore