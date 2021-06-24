import create from 'zustand'
import { cloneDeep, find } from 'lodash'

import { MODES, STAGE_PADDING, DEFAULT_TOOL_CONFIG } from './constants'
import getPointerPosition from './utils/getPointerPosition'
import loadImageFromURL from '../../utils/loadImageFromURL'
import resizeImage from '../../utils/resizeImage'

import { mockupLabels, mockupImageList } from './mockup'

const useAnnotationStore = create((set, get) => ({
  stageRef: null,
  stageSize: { width: 0, height: 0 },
  activeMode: MODES.DRAW_POLYGON.name,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef}),
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

  currentMousePosition: { x: 0, y: 0},
  drawingAnnotation: null,
  isPredicting: false,

  getAnnotations: () => get().annotations,
  setAnnotations: (newAnnotations) => set({ annotations: newAnnotations }),
  appendAnnotation: (newAnnotation) => set(state => ({ annotations: [...state.annotations, newAnnotation] })),
  updateCurrentMousePosition: () => set(state => ({ currentMousePosition: getPointerPosition(state.stageRef) })),
  getCurrentMousePosition: () => get().currentMousePosition,
  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  setIsPredicting: (status) => set({ isPredicting: status}),

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

  toolConfig: DEFAULT_TOOL_CONFIG,
  setToolConfig: (newToolConfig) => set(state => ({ toolConfig: { ...state.toolConfig, [state.activeMode]: newToolConfig } })),
  getToolConfig: () => get().toolConfig[get().activeMode] || {},
}))

export default useAnnotationStore