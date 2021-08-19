import create from 'zustand'
import { filter, cloneDeep, find } from 'lodash'

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
    set({ 
      selectedObjectId: null,
      annotationObjects 
    })

    setIsLoading("loading_annotation_objects", false)
  },
  setSelectedObjectId: (newObjectId) => set({ selectedObjectId: newObjectId }),
  getSelectedObjectId: () => get().selectedObjectId,
  getOrCreateSelectedObjectId: async (dataInstanceId, annotationType, properties = {}, attributes = {}) => {
    const selectedObjectId = get().selectedObjectId
    const annotationObjects = get().annotationObjects

    if (selectedObjectId) {
      return selectedObjectId
    } else {
      const newAnnotationObject = new AnnotationObjectClass('', dataInstanceId, '', annotationType, properties, attributes)
      await AnnotationObjectService.postAnnotationObject(newAnnotationObject)
      set({
        annotationObjects: [...annotationObjects, newAnnotationObject],
        selectedObjectId: newAnnotationObject.id,
      })
      return newAnnotationObject.id
    }
  },
  setAnnotationObjectProperties: (id, newProperties, commit = true) => {
    const annotationObjects = get().annotationObjects.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newAnnotation = cloneDeep(object)
        newAnnotation.updateProperties = newProperties
        if (commit) {
          AnnotationObjectService.postAnnotationObject(newAnnotation)
        }
        return newAnnotation
      }
    })

    set({ annotationObjects })
  },
  setAnnotationObjectAttributes: (id, newAttributes, commit = true) => {
    const annotationObjects = get().annotationObjects.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newAnnotation = cloneDeep(object)
        newAnnotation.updateAttributes = newAttributes
        if (commit) {
          AnnotationObjectService.postAnnotationObject(newAnnotation)
        }
        return newAnnotation
      }
    })

    set({ annotationObjects })
  },
  setAnnotationObjectLabel: (id, newLabelId) => {
    const annotationObjects = get().annotationObjects.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newAnnotationObject = cloneDeep(object)
        newAnnotationObject.labelId = newLabelId
        AnnotationObjectService.postAnnotationObject(newAnnotationObject)
        return newAnnotationObject
      }
    })

    set({ annotationObjects })
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
    set({ 
      drawingAnnotation: null,
      annotations 
    })
    setIsLoading("loading_annotations", false)
  },
  setAnnotation: async (annotationId, newEditingAnnotationData, options = {}) => {
    const { commitAnnotation = true } = options
    let annotations = cloneDeep(get().annotations)

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
        if (annotation.id !== annotationId) {
          return annotation
        } else {

          annotation.updateData = newEditingAnnotationData
          if (commitAnnotation) {
            annotation.applyUpdate()
          }

          return annotation
        }
      })
    })

    set({ annotations })
  },
  updateAnnotation: async (newAnnotation, options = {}) => {
    const { commitAnnotation = true } = options
    let annotations = cloneDeep(get().annotations)

    try {
      if (commitAnnotation) {
        newAnnotation.applyUpdate()
      }
    } catch (error) {
      console.log(error)
    }

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
        if (annotation.id !== newAnnotation.id) {
          return annotation
        } else {
          return newAnnotation
        }
      })
    })

    set({ annotations })
  },
  getAnnotationByAnnotationObjectId: (annotationObjectId, annotationImageId) => {
    let annotations = get().annotations

    return find(annotations[annotationImageId], { annotationObjectId })
  },
  deleteAnnotation: (deleteAnnotationId, options = {}) => {
    const { commitAnnotation = true } = options

    try {
      if (commitAnnotation) {
        AnnotationService.deleteAnnotationById(deleteAnnotationId)
      }
    } catch (error) {
      console.log(error)
    }

    let annotations = cloneDeep(get().annotations)

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = filter(annotations[annotationImageId], (ann) => ann.id !== deleteAnnotationId)
    }) 

    set({ annotations })
  },
  cleanUpPropagatingAnnotation: (propagatingAnnotationId) => {
    let annotations = cloneDeep(get().annotations)

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = filter(annotations[annotationImageId], (ann) => ann.id !== propagatingAnnotationId)
    })
    set({ annotations })
  },


  drawingAnnotation: null,
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  appendAnnotation: async (newAnnotation, options = {} ) => {
    const { commitAnnotation = true } = options
    try {
      if (commitAnnotation) {
        await newAnnotation.applyUpdate()
      }
    } catch (error) {
      console.log(error)
    }
    const annotations = get().annotations
    if (!annotations[newAnnotation.annotationImageId]) {
      annotations[newAnnotation.annotationImageId] = []
    }
    annotations[newAnnotation.annotationImageId] = [...annotations[newAnnotation.annotationImageId], newAnnotation]

    set({ annotations })
  },
}))

export default useAnnotationStore