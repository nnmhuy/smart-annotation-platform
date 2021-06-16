import create from 'zustand'
import { cloneDeep } from 'lodash'

import { MODES } from './constants'

const useAnnotationStore = create((set, get) => ({
  stageRef: null,
  activeMode: MODES.DRAW_BBOX.name,
  isMovingViewport: false,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef}),
  setActiveMode: (newActiveMode) => set({ activeMode: newActiveMode }),
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
  getCurrentMousePosition: () => get().currentMousePosition,
  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),

  editingAnnotationId: null,
  setEditingAnnotationId: (newEditingAnnotationId) => set({ editingAnnotationId: newEditingAnnotationId}),
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
}))

export default useAnnotationStore