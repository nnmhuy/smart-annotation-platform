import create from 'zustand'
import { filter } from 'lodash'

import LabelService from '../../../services/LabelService'
import AnnotationObjectService from '../../../services/AnnotationObjectService'
import AnnotationService from '../../../services/AnnotationService'


const useAnnotationStore = create((set, get) => ({
  isLoading: {},
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  labels: [],
  loadAnnotationLabels: async (datasetId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_dataset_labels", true)

    const labels = await LabelService.getLabelByDataset(datasetId)
    set({ labels })

    setIsLoading("loading_dataset_labels", false)
  },

  annotationObjects: [],
  loadAnnotationObjects: async (instanceId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_annotation_objects", true)

    const annotationObjects = await AnnotationObjectService.getAnnotationObjectsByDataInstance(instanceId)
    set({ annotationObjects })

    setIsLoading("loading_annotation_objects", false)
  },

  annotations: [],
  appendAnnotation: (newAnnotation) => {
    // newAnnotation.applyUpdateAnnotation()
    set(state => ({ annotations: [...state.annotations, newAnnotation] }))
  },
  deleteAnnotation: (deleteAnnotationId) => {
    // AnnotationService.deleteAnnotationById(deleteAnnotationId)

    set(state => ({
      annotations: filter(state.annotations, ann => ann.id !== deleteAnnotationId)
    }))
  },

  drawingAnnotation: null,
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  
}))

export default useAnnotationStore