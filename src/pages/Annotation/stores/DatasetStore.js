import create from 'zustand'
import { find, findIndex } from 'lodash'

import DatasetService from '../../../services/DatasetService'
import DataInstanceService from '../../../services/DataInstanceService'


const useDatasetStore = create((set, get) => ({
  dataset: {},
  instanceId: null,
  dataInstances: [],
  isLoading: {},
  playingState: {},

  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  instanceIndex: undefined, 
  setInstanceId: (id) => {
    const instanceIndex = findIndex(get().dataInstances, { id })
    set({ instanceId: id, instanceIndex })
  },
  getInstanceId: () => get().instanceId,
  getDataInstance: () => find(get().dataInstances, { id: get().instanceId }),
  getCurrentAnnotationImageId: () => {
    const playingState = get().playingState
    const dataInstances = get().dataInstances
    const instanceIndex = get().instanceIndex

    return dataInstances[instanceIndex].getCurrentImage(playingState).id
  },

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

  getPlayingState: () => get().playingState,
  setPlayingState: (newState) => set(state => ({ playingState: {...state.playingState, ...newState }})),
  increaseBufferingFrame: (skip) => set(state => ({ playingState: { ...state.playingState, bufferingFrame: state.playingState.bufferingFrame + skip }})),
  increaseLazyBufferingFrame: (skip) => set(state => ({ playingState: { ...state.playingState, lazyBufferingFrame: state.playingState.lazyBufferingFrame + skip }})),
  increasePlayingFrame: (skip) => set(state => ({ playingState: { ...state.playingState, playingFrame: state.playingState.playingFrame + skip }})),
}))

export default useDatasetStore