import create from 'zustand'
import { find, filter, cloneDeep } from 'lodash'

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
      AnnotationObjectService.postAnnotationObject(newAnnotationObject)
      set({
        annotationObjects: [...annotationObjects, newAnnotationObject],
        selectedObjectId: newAnnotationObject.id,
      })
      return newAnnotationObject.id
    }
  },
  deleteAnnotationObject: (objectId) => {
    const selectedObjectId = get().selectedObjectId
    let newAnnotationObjects = get().annotationObjects
    let newAnnotations = get().annotations

    Object.keys(newAnnotations).forEach(annotationImageId => {
      newAnnotations[annotationImageId] = filter(newAnnotations[annotationImageId], ann => ann.annotationObjectId !== objectId)
    })
    newAnnotationObjects = filter(newAnnotationObjects, obj => obj.id !== objectId)

    set({ annotations: newAnnotations, annotationObjects: newAnnotationObjects })

    if (selectedObjectId === objectId) {
      set({ selectedObjectId: null })
    }
    AnnotationObjectService.deleteAnnotationObjectById(objectId)
  },

  annotations: {},
  loadAnnotations: async (instanceId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_annotations", true)

    let annotationsObj = await AnnotationService.getAnnotationsByDataInstance(instanceId)
    let annotations = {}
    annotationsObj.forEach(ann => {
      if (!annotations[ann.annotationImageId]) {
        annotations[ann.annotationImageId] = []
      }
      annotations[ann.annotationImageId].push(ann)
    })
    set({ annotations })
    setIsLoading("loading_annotations", false)
  },
  setAnnotation: (annotationId, newEditingAnnotationData, commitAnnotation) => {
    let annotations = get().annotations

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
        if (annotation.id !== annotationId) {
          return annotation
        } else {
          let newAnnotation = cloneDeep(annotation)
          newAnnotation.updateData = newEditingAnnotationData
          if (commitAnnotation) {
            newAnnotation.applyUpdate()
          }
          return newAnnotation
        }
      })
    })

    set({ annotations })
  },
  deleteAnnotation: (deleteAnnotationId) => {
    AnnotationService.deleteAnnotationById(deleteAnnotationId)
    let annotations = get().annotations

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = filter(annotations[annotationImageId], (ann) => ann.id !== deleteAnnotationId)
    }) 

    set({ annotations })
  },


  drawingAnnotation: null,
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  appendAnnotation: (newAnnotation) => {
    newAnnotation.applyUpdate()
    const annotations = get().annotations
    if (!annotations[newAnnotation.annotationImageId]) {
      annotations[newAnnotation.annotationImageId] = []
    }
    annotations[newAnnotation.annotationImageId] = [...annotations[newAnnotation.annotationImageId], newAnnotation]
    set({ annotations })
  },
}))

export default useAnnotationStore