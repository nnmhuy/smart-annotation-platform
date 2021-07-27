import create from 'zustand'
import { filter } from 'lodash'

import LabelService from '../../../services/LabelService'
import AnnotationObjectService from '../../../services/AnnotationObjectService'
import AnnotationService from '../../../services/AnnotationService'
import AnnotationObjectClass from '../../../classes/AnnotationObjectClass'


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

  selectedObjectId: null,
  annotationObjects: [],
  loadAnnotationObjects: async (instanceId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_annotation_objects", true)

    const annotationObjects = await AnnotationObjectService.getAnnotationObjectsByDataInstance(instanceId)
    set({ annotationObjects })

    setIsLoading("loading_annotation_objects", false)
  },
  setSelectedObjectId: (newObjectId) => set({ selectedObjectId: newObjectId }),
  getOrCreateSelectedObjectId: (dataInstanceId, annotationType, properties = {}) => {
    const selectedObjectId = get().selectedObjectId
    const annotationObjects = get().annotationObjects

    if (selectedObjectId) {
      return selectedObjectId
    } else {
      const newAnnotationObject = new AnnotationObjectClass('', dataInstanceId, '', annotationType, properties, {})
      newAnnotationObject.applyUpdate()
      set({
        annotationObjects: [...annotationObjects, newAnnotationObject],
        selectedObjectId: newAnnotationObject.id,
      })
      return newAnnotationObject.id
    }
  },
  deleteAnnotationObject: (objectId) => {
    const selectedObjectId = get().selectedObjectId
    const annotationObjects = get().annotationObjects
    set({ annotationObjects: filter(annotationObjects, ann => ann.id !== objectId) })

    if (selectedObjectId === objectId) {
      set({ selectedObjectId: null })
    }
    AnnotationObjectService.deleteAnnotationObjectById(objectId)
  },

  annotations: [],

  drawingAnnotation: null,
  getDrawingAnnotation: () => { /* TODO */  return null },
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
}))

export default useAnnotationStore