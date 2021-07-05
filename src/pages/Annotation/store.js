import create from 'zustand'
import { cloneDeep, find, filter } from 'lodash'

import RestConnector from '../../connectors/RestConnector'
import { MODES, STAGE_PADDING, DEFAULT_TOOL_CONFIG } from './constants'
import getPointerPosition from './utils/getPointerPosition'
import loadImageFromURL from '../../utils/loadImageFromURL'
import resizeImage from '../../utils/resizeImage'

import LabelClass from '../../classes/LabelClass'
import ImageClass from '../../classes/ImageClass'
import BBoxAnnotationClass from '../../classes/BBoxAnnotationClass'

import { mockupLabels, mockupImageList } from './mockup'

const useAnnotationStore = create((set, get) => ({
  datasetId: null,
  isLoadingDatasetData: false,
  stageRef: null,
  stageSize: { width: 0, height: 0 },
  activeMode: MODES.DRAW_POLYGON.name,

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


  annotations: [],
  imageId: null,
  image: null,
  imageList: mockupImageList,
  selectedId: null,
  highlightId: null,

  setImageId: async (newImageId) => {
    const imageList = get().imageList
    const stage = get().stageRef
    const stageSize = get().stageSize

    const data = imageList.find(data => data.id === newImageId)
    const newImage = await loadImageFromURL(data.imageURL)
      .then((imageData) => resizeImage(imageData, {
        maxWidth: stageSize.width - STAGE_PADDING,
        maxHeight: stageSize.height - STAGE_PADDING,
      }))

    stage.position({
      x: (stageSize.width - newImage.width) / 2,
      y: (stageSize.height - newImage.height) / 2,
    });
    stage.scale({ x: 1, y: 1 })

    set({
      imageId: newImageId,
      image: newImage,
      drawingAnnotation: null,
      editingAnnotationId: null,
    })
  },
  getImageId: () => get().imageId,
  getImage: () => get().image,

  currentMousePosition: { x: 0, y: 0 },
  drawingAnnotation: null,
  isPredicting: false,

  setIsPredicting: (status) => set({ isPredicting: status }),
  getAnnotations: () => get().annotations,
  setAnnotations: (newAnnotations) => set({ annotations: newAnnotations }),
  appendAnnotation: (newAnnotation) => set(state => ({ annotations: [...state.annotations, newAnnotation] })),
  updateCurrentMousePosition: () => set(state => ({ currentMousePosition: getPointerPosition(state.stageRef) })),
  getCurrentMousePosition: () => get().currentMousePosition,
  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  deleteAnnotation: (deleteAnnotationId) => {
    set(state => ({
      annotations: filter(state.annotations, ann => ann.id !== deleteAnnotationId)
    }))
  },

  editingAnnotationId: null,
  getEditingAnnotationId: () => get().editingAnnotationId,
  getEditingAnnotation: () => find(get().annotations, { id: get().editingAnnotationId }),
  setEditingAnnotationId: (newEditingAnnotationId) => set({ editingAnnotationId: newEditingAnnotationId }),
  setEditingAnnotation: (newEditingAnnotationData) => set(state => ({
    annotations: state.annotations.map(annotation => {
      if (annotation.id !== state.editingAnnotationId) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateData = newEditingAnnotationData
        return newAnnotation
      }
    })
  })),
  setAnnotationProperties: (id, newProperties) => set(state => ({
    annotations: state.annotations.map(annotation => {
      if (annotation.id !== id) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateProperties = newProperties
        return newAnnotation
      }
    })
  })),

  labels: mockupLabels,
  setEditingAnnotationLabelId: (newLabelId) => set(state => ({
    annotations: state.annotations.map(annotation => {
      if (annotation.id !== state.editingAnnotationId) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateLabel = newLabelId
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
    set({ isLoadingDatasetData: true })
    // load images
    const imageResponse = await RestConnector.get(`images?dataset_id=${datasetId}`)
    const imagesObj = imageResponse.data.map(image => ImageClass.constructorFromServerData(image))

    // load annotation label
    const annotationLabelResponse = await RestConnector.get(`annotation_labels?project_id=${projectId}`)
    const labelsObj = annotationLabelResponse.data.map(label => LabelClass.constructorFromServerData(label))

    // load annotations
    const annotationResponse = await RestConnector.get(`annotations?dataset_id=${datasetId}`)

    const annotationsObj = annotationResponse.data.map(ann => {
      return BBoxAnnotationClass.constructorFromServerData(ann)
    })

    set({
      isLoadingDatasetData: false,
      // imageList: imagesObj,
      labels: labelsObj,
      annotations: annotationsObj,
    })
  }
}))

export default useAnnotationStore