import create from 'zustand'
import { cloneDeep, find, filter, remove } from 'lodash'

import RestConnector from '../../connectors/RestConnector'
import { MODES, STAGE_PADDING, DEFAULT_TOOL_CONFIG } from './constants'
import getPointerPosition from './utils/getPointerPosition'
import loadImageFromURL from '../../utils/loadImageFromURL'
import resizeImage from '../../utils/resizeImage'

import LabelClass from '../../classes/LabelClass'
import ImageClass from '../../classes/ImageClass'
import BBoxAnnotationClass from '../../classes/BBoxAnnotationClass'
import PolygonAnnotationClass from '../../classes/PolygonAnnotationClass'
import ScribbleToMaskAnnotationClass from '../../classes/ScribbleToMaskAnnotationClass'

const useAnnotationStore = create((set, get) => ({
  datasetId: null,
  isLoading: {},
  stageRef: null,
  stageSize: { width: 0, height: 0 },
  activeMode: MODES.CURSOR.name,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef }),
  setStageSize: (newStageSize) => set({ stageSize: newStageSize }),
  setActiveMode: (newActiveMode) => set(state => {
    const stageCursor = get(find(MODES, { name: state.activeMode }), 'cursor', 'default')
    state.stageRef.container().style.cursor = stageCursor

    return {
      activeMode: newActiveMode,
      drawingAnnotation: null,
      editingAnnotationId: null,
    }
  }),
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value }})),


  annotations: [],
  imageId: null,
  image: null,
  imageList: [],
  selectedId: null,
  highlightId: null,

  setImageId: async (newImageId) => {
    const imageList = get().imageList
    const stage = get().stageRef
    const stageSize = get().stageSize
    const isLoading = get().isLoading

    set({
      isLoading: {
        ...isLoading,
        isLoadingImageData: true
      }
    })

    const data = imageList.find(data => data.id === newImageId)
    let imageBlob = null
    const newImage = await loadImageFromURL(data.imageURL)
      .then(({ blob, base64 }) => {
        imageBlob = blob
        return resizeImage(base64, {
          maxWidth: stageSize.width - STAGE_PADDING,
          maxHeight: stageSize.height - STAGE_PADDING,
        })
      })


    stage.position({
      x: (stageSize.width - newImage.width) / 2,
      y: (stageSize.height - newImage.height) / 2,
    });
    stage.scale({ x: 1, y: 1 })

    // load annotations
    const annotationResponse = await RestConnector.get(`annotations?image_id=${newImageId}`)

    const annotationsObj = await Promise.all(annotationResponse.data.map(async ann => {
      switch (ann._cls) {
        case "Annotation.BBoxAnnotation":
          return BBoxAnnotationClass.constructorFromServerData(ann)
        case "Annotation.PolygonAnnotation":
          return PolygonAnnotationClass.constructorFromServerData(ann)
        case "Annotation.MaskAnnotation":
          return await ScribbleToMaskAnnotationClass.constructorFromServerData(ann)
        default:
          return {}
      }
    }))

    set({
      isLoading: {
        ...isLoading,
        isLoadingImageData: false,
      },
      imageId: newImageId,
      image: {
        blob: imageBlob,
        ...newImage,
      },
      annotations: annotationsObj,
      drawingAnnotation: null,
      editingAnnotationId: null,
    })
  },
  getImageId: () => get().imageId,
  getImage: () => get().image,

  currentMousePosition: { x: 0, y: 0 },
  drawingAnnotation: null,

  getAnnotations: () => get().annotations,
  setAnnotations: (newAnnotations) => set({ annotations: newAnnotations }),
  appendAnnotation: (newAnnotation) => {
    newAnnotation.applyUpdateAnnotation()
    set(state => ({ annotations: [...state.annotations, newAnnotation] }))
  },
  updateCurrentMousePosition: () => set(state => ({ currentMousePosition: getPointerPosition(state.stageRef) })),
  getCurrentMousePosition: () => get().currentMousePosition,
  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  deleteAnnotation: (deleteAnnotationId) => {
    const annotation = find(get().annotations, { id: deleteAnnotationId })
    annotation.applyDeleteAnnotation()

    set(state => ({
      annotations: filter(state.annotations, ann => ann.id !== deleteAnnotationId)
    }))
  },

  editingAnnotationId: null,
  getEditingAnnotationId: () => get().editingAnnotationId,
  getEditingAnnotation: () => find(get().annotations, { id: get().editingAnnotationId }),
  setEditingAnnotationId: (newEditingAnnotationId) => {
    // Put the editing annotation to front of rendering layer
    let annotations = get().annotations
    let editingAnnotation = find(annotations, { id: newEditingAnnotationId })
    if (newEditingAnnotationId) {
      remove(annotations, { id: newEditingAnnotationId })
      annotations = [...annotations, editingAnnotation]

      set({
        editingAnnotationId: newEditingAnnotationId,
        annotations
      })
    } else {

      set({ editingAnnotationId: newEditingAnnotationId, })
    }
  },
  setEditingAnnotation: (newEditingAnnotationData, commitAnnotation) => {
    const editingAnnotationId = get().editingAnnotationId

    const annotations = get().annotations.map(annotation => {
      if (annotation.id !== editingAnnotationId) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateData = newEditingAnnotationData
        if (commitAnnotation) {
          newAnnotation.applyUpdateAnnotation()
        }
        return newAnnotation
      }
    })

    set({ annotations })
  },
  setAnnotationProperties: (id, newProperties) => {
    const annotations = get().annotations.map(annotation => {
      if (!annotation) {
        debugger
      }
      if (annotation.id !== id) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateProperties = newProperties
        return newAnnotation
      }
    })

    set({ annotations: annotations })
  },

  labels: [],
  setEditingAnnotationLabelId: (newLabelId) => set(state => ({
    annotations: state.annotations.map(annotation => {
      if (annotation.id !== state.editingAnnotationId) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateLabel = newLabelId
        newAnnotation.applyUpdateAnnotation()
        return newAnnotation
      }
    })
  })),
  setLabelProperties: (id, newProperties) => set(state => ({
    labels: state.labels.map(label => {
      if (label.id !== id) {
        return label
      } else {
        let newLabel = cloneDeep(label)
        newLabel.updateProperties = newProperties
        return newLabel
      }
    })
  })),

  toolConfig: DEFAULT_TOOL_CONFIG,
  setToolConfig: (newToolConfig) => set(state => ({ toolConfig: { ...state.toolConfig, [state.activeMode]: newToolConfig } })),
  getToolConfig: () => get().toolConfig[get().activeMode] || {},


  getDatasetData: async (projectId, datasetId) => {
    set(state => ({ isLoading: { ...state.isLoading, isLoadingDatasetData: true } }))
    // TODO: request in parallel

    // load images
    const imageResponse = await RestConnector.get(`images?dataset_id=${datasetId}`)
    const imagesObj = imageResponse.data.map(image => ImageClass.constructorFromServerData(image))

    // load annotation label
    const annotationLabelResponse = await RestConnector.get(`annotation_labels?project_id=${projectId}`)
    const labelsObj = annotationLabelResponse.data.map(label => LabelClass.constructorFromServerData(label))

    set(state => ({
      isLoading: {
        ...state.isLoading,
        isLoadingDatasetData: false
      },
      imageList: imagesObj,
      labels: labelsObj,
    }))
  }
}))

export default useAnnotationStore