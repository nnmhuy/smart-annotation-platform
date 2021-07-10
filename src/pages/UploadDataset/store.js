import create from 'zustand'
import { get as getLodash, filter } from 'lodash'

import ImageService from '../../services/ImageService'

const useUploadDatasetStore = create((set, get) => ({
  isLoading: {},
  files: [],
  progressInfos: {},
  uploadLogs: {},
  uploadedFiles: [],
  isUploaded: false,

  setIsUploaded: (value) => set({ isUploaded: value }),
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),
  appendFiles: (files) => {
    let currentFiles = [...get().files]
    let newFiles = [...currentFiles, ...files]

    let isDuplicate = false
    newFiles.forEach(file => {
      const duplicateError = filter(newFiles, (f) => f.name === file.name).length > 1
      if (duplicateError) {
        file = Object.assign(file, {
          duplicateError: true
        })
      }
      isDuplicate = isDuplicate || duplicateError
    })

    if (isDuplicate) {
      alert("Error: files with duplicated names won't be uploaded")
    }

    set({ files: newFiles })
  },

  deleteFileAtIndex: (index) => {
    let currentFiles = [...get().files]
    const removedFiles = currentFiles.splice(index, 1)
    
    set({ files: currentFiles })
    removedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  },

  setProgressInfo: (index, value) => {
    const progressInfos = get().progressInfos

    set({ 
      progressInfos: {
        ...progressInfos,
        [index]: value
      }
    })
  },

  setUploadLogs: (index, err) => {
    const uploadLogs = get().uploadLogs
    set({
      uploadLogs: {
        ...uploadLogs,
        [index]: err 
    }})
  },


  uploadFiles: async (datasetId) => {
    const setIsLoading = get().setIsLoading
    const setIsUploaded = get().setIsUploaded

    setIsLoading("uploading", true)
  
    const files = get().files
    const setProgressInfo = get().setProgressInfo
    const setUploadLogs = get().setUploadLogs
  
    let uploadedFiles = await Promise.all(files.map(async (file, fileIndex) => {
      return ImageService.upload(file, datasetId, (event) => {
        setProgressInfo(fileIndex, Math.round((100 * event.loaded) / event.total))
      })
      .then(file => {
        setUploadLogs(fileIndex, {
          success: true,
          message: "Success"
        })
        return file
      })
      .catch((error) => {
        setProgressInfo(fileIndex, 0)
        setUploadLogs(fileIndex, {
          success: false,
          message: getLodash(error, 'data.errors', 'upload error')
        })
        return null
      });
    }))
    
    uploadedFiles = filter(uploadedFiles, (file) => file !== null)
    set({ uploadedFiles })
    setIsLoading("uploading", false)
    setIsUploaded(true)
  }
}))

export default useUploadDatasetStore