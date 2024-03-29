import create from 'zustand'
import { find } from 'lodash'
import { cloneDeep } from 'lodash'

import DatasetService from '../../../services/DatasetService'
import DataInstanceService from '../../../services/DataInstanceService'

import { NUM_ANNO_DATA_PER_PAGE } from '../constants'


const useDatasetStore = create((set, get) => ({
  dataset: {},
  dataInstances: [],
  isLoading: {},
  playingState: {},

  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  instanceId: null,
  currentAnnotationImageId: null,
  // currentAnnotationImage: null, // May cause duplication and take time to reload
  setInstanceId: (id) => set({ instanceId: id }),
  getInstanceId: () => get().instanceId,
  getDataInstance: () => find(get().dataInstances, { id: get().instanceId }),
  getCurrentAnnotationImageId: () => get().currentAnnotationImageId,
  setCurrentAnnotationImageId: (id) => set({ currentAnnotationImageId: id }),
  // setCurrentAnnotationImage: (currentAnnotationImage) => set({ currentAnnotationImage }),

  getDatasetInfo: async (datasetId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_dataset_info", true)

    // load dataset
    const dataset = await DatasetService.getDatasetById(datasetId)

    set({ dataset })
    setIsLoading("loading_dataset_info", false)
  },

  getDataInstances: async (datasetId, page = 1, per_page = 20) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_data_instances", true)

    const dataInstancesObj = await DataInstanceService.getDataInstancesByDataset(datasetId, page, per_page)

    set({ dataInstances: dataInstancesObj })

    setIsLoading("loading_data_instances", false)
  },

  updateAnnotateStatusDataInstance: (id, annotateStatus) => {
    const dataInstances = get().dataInstances.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newDataInstance = cloneDeep(object)
        newDataInstance.annotateStatus = annotateStatus
        DataInstanceService.putDataInstance(newDataInstance)
        return newDataInstance
      }
    })
    set({dataInstances})
  },

  setDescriptionDataInstance: (id, description) => {
    const dataInstances = get().dataInstances.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newDataInstance = cloneDeep(object)
        newDataInstance.description = description
        DataInstanceService.putDataInstance(newDataInstance)
        return newDataInstance
      }
    })
    set({dataInstances}) 
  },

  getPlayingState: () => get().playingState,
  setPlayingState: (newState) => set(state => ({ playingState: {...state.playingState, ...newState }})),
  increaseBufferingFrame: (skip) => set(state => ({ playingState: { ...state.playingState, bufferingFrame: state.playingState.bufferingFrame + skip }})),
  increaseLazyBufferingFrame: (skip) => set(state => ({ playingState: { ...state.playingState, lazyBufferingFrame: state.playingState.lazyBufferingFrame + skip }})),
  increasePlayingFrame: (skip) => set(state => ({ playingState: { ...state.playingState, playingFrame: state.playingState.playingFrame + skip }})),
  isPlaying: false,
  getIsPlaying: () => get().isPlaying,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}))

export default useDatasetStore