import create from 'zustand'

import { MODES } from './constants'

const useAnnotationStore = create(set => ({
  stageRef: null,
  activeMode: MODES.DRAW_BBOX,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef}),
  setActiveMode: (newActiveMode) => set({ activeMode: newActiveMode }),


  annotations: [],
  image: null,
  selectedId: null,
  highlightId: null,

  currentMousePosition: { x: 0, y: 0},
  drawingShape: null,

  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  setDrawingShape: (newDrawingShape) => set({ drawingShape: newDrawingShape }),
  handleSetDrawingShape: (func) => set(state => func(state)),
  handleFinishDrawingShape: (func) => set(state => func(state))
  // handleFinishDrawingShape: (obj) => set(state => ({ 
  //     annotations: [...state.annotations, obj],
  //     drawingShape: null
  //   }))
  // ,

}))

export default useAnnotationStore