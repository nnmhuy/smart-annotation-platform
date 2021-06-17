import create from 'zustand'
import { cloneDeep, find, get } from 'lodash'

import { MODES } from './constants'
import getPointerPosition from './utils/getPointerPosition'

import { mockupLabels } from './mockup'

const useAnnotationStore = create((set, get) => ({
  stageRef: null,
  activeMode: MODES.DRAW_BBOX.name,
  isMovingViewport: false,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef}),
  setActiveMode: (newActiveMode) => set(state => {
    const stageCursor = get(find(MODES, { name: state.activeMode }), 'cursor', 'default')
    state.stageRef.container().style.cursor = stageCursor

    return { activeMode: newActiveMode }
  }),
  setIsMovingViewport: (newStatus) => set({ isMovingViewport: newStatus }),
  handleSetViewport: (newPos) => {
    let stage = get().stageRef
    let isMovingViewport = get().isMovingViewport
  
    if (!isMovingViewport) {
      return
    }
    // TODO: limit viewport
    stage.position(newPos);
    stage.batchDraw();
  },


  annotations: [],
  image: null,
  selectedId: null,
  highlightId: null,

  currentMousePosition: { x: 0, y: 0},
  drawingAnnotation: null,

  getAnnotations: () => get().annotations,
  setAnnotations: (newAnnotations) => set({ annotations: newAnnotations }),
  updateCurrentMousePosition: () => set(state => ({ currentMousePosition: getPointerPosition(state.stageRef) })),
  getCurrentMousePosition: () => get().currentMousePosition,
  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),

  editingAnnotationId: null,
  getEditingAnnotationId: () => get().editingAnnotationId,
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

}))

export default useAnnotationStore