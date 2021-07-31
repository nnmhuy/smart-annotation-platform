import create from 'zustand'
import { get as getLodash, filter } from 'lodash'

import DatasetService from '../../services/DatasetService'
import DataInstanceService from '../../services/DataInstanceService'

const initialState = {
  datasetInfo: {},
  isLoading: {},
  files: [],
  progressInfos: {},
  uploadLogs: {},
  uploadedFiles: [],
  isUploaded: false,
}

const useUploadDatasetStore = create((set, get) => ({
  ...initialState,

  resetAllState: () => {
    set({ ...initialState })
  },

  setIsUploaded: (value) => set({ isUploaded: value }),
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  getDatasetInfo: async (datasetId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading-dataset-info", true)

    const dataset = await DatasetService.getDatasetById(datasetId)
    set({ datasetInfo: dataset })

    setIsLoading("loading-dataset-info", false)
  },

  appendFile: (file) => {
    const datasetInfo = get().datasetInfo

    set(state => ({ files: [...state.files, file] }))

    const uploadFile = get().uploadFile
    uploadFile(datasetInfo.id, file)
  },

  deleteFileById: (fileId) => {
    let currentFiles = [...get().files]
    const removedFiles = filter(currentFiles, (file) => file.id === fileId)
    const remainingFiles = filter(currentFiles, (file) => file.id !== fileId)

    set({ files: remainingFiles })

    removedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview)
    })
  },

  uploadedFiles: {},
  appendUploadedFiles: (localId, uploadedFile) => set(state => (
    {
      uploadedFiles:
      {
        ...state.uploadedFiles,
        [localId]: uploadedFile
      }
    }
  )),

  setProgressInfo: (fileId, value) => {
    const progressInfos = get().progressInfos

    set({
      progressInfos: {
        ...progressInfos,
        [fileId]: value
      }
    })
  },

  setUploadLogs: (fileId, log) => set(state => ({
    uploadLogs: {
      ...state.uploadLogs,
      [fileId]: log
    }
  })),

  uploadFile: async (datasetId, file) => {
    const setProgressInfo = get().setProgressInfo
    const setUploadLogs = get().setUploadLogs
    const appendUploadedFiles = get().appendUploadedFiles

    DataInstanceService.upload(file, datasetId, (event) => {
      setProgressInfo(file.id, Math.round((100 * event.loaded) / event.total))
    })
      .then((uploadedFile) => {
        setUploadLogs(file.id, {
          success: true,
          message: "Success"
        })
        appendUploadedFiles(file.id, uploadedFile)
      })
      .catch((error) => {
        setUploadLogs(file.id, {
          success: false,
          message: getLodash(error, 'data.errors', 'upload error')
        })
      });
  }
}))

export default useUploadDatasetStore