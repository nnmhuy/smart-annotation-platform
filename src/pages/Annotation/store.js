import create from 'zustand'
import { cloneDeep } from 'lodash'

import { MODES } from './constants'

const useAnnotationStore = create(set => ({
  stageRef: null,
  activeMode: MODES.DRAW_BBOX.name,
  isMovingViewport: false,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef}),
  setActiveMode: (newActiveMode) => set({ activeMode: newActiveMode }),
  setIsMovingViewport: (newStatus) => set({ isMovingViewport: newStatus }),
  handleSetViewport: (newPos) => set(state => {
    if (!state.isMovingViewport) {
      return
    }

    state.stageRef.position(newPos);
    state.stageRef.batchDraw();
  }),


  annotations: [],
  image: null,
  selectedId: null,
  highlightId: null,

  currentMousePosition: { x: 0, y: 0},
  drawingAnnotation: null,

  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  handleSetDrawingAnnotation: (func) => set(state => func(state)),
  handleFinishDrawingAnnotation: (func) => set(state => func(state)),
  

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