import create from 'zustand'

import { MODES } from '../constants'

const useGeneralStore = create((set, get) => ({
  isLoading: {},
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  stage: null,
  stageSize: { width: 0, height: 0 },
  setStage: (newStage) => set({ stage: newStage }),
  setStageSize: (newStageSize) => set({ stageSize: newStageSize }),
  
  activeMode: MODES.CURSOR.name,
  setActiveMode: (newMode) => set({ activeMode: newMode }),
}))

export default useGeneralStore