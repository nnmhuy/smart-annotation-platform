import create from "zustand";
import { get as getLodash, filter } from "lodash";
import _ from "lodash";

import DatasetService from "../../services/DatasetService";
import DataInstanceService from "../../services/DataInstanceService";

const initialState = {
  datasetInfo: {},
  isLoading: {},
  files: [],
  progressInfos: {},
  uploadLogs: {},
  uploadedFiles: [],
  isUploaded: false,
};

const useUploadDatasetStore = create((set, get) => ({
  ...initialState,

  resetAllState: () => {
    set({ ...initialState });
  },

  setIsUploaded: (value) => set({ isUploaded: value }),
  setIsLoading: (name, value) =>
    set((state) => ({ isLoading: { ...state.isLoading, [name]: value } })),

  getDatasetInfo: async (datasetId) => {
    const setIsLoading = get().setIsLoading;
    setIsLoading("loading-dataset-info", true);

    const dataset = await DatasetService.getDatasetById(datasetId);
    set({ datasetInfo: dataset });

    setIsLoading("loading-dataset-info", false);
  },

  appendFile: async (file) => {
    const datasetInfo = get().datasetInfo;

    set((state) => ({ files: [...state.files, file] }));

    const uploadFile = get().uploadFile;
    await uploadFile(datasetInfo.id, file);
  },

  appendFiles: async (files) => {
    const datasetInfo = get().datasetInfo;

    set((state) => ({ files: [...state.files, ...files] }));

    const uploadMultipleFiles = get().uploadMultipleFiles;
    await uploadMultipleFiles(datasetInfo.id, files);
  },

  deleteFileById: (fileId) => {
    let currentFiles = [...get().files];
    const removedFiles = filter(currentFiles, (file) => file.id === fileId);
    const remainingFiles = filter(currentFiles, (file) => file.id !== fileId);

    set({ files: remainingFiles });

    removedFiles.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
  },

  uploadedFiles: {},
  appendUploadedFile: (localId, uploadedFile) =>
    set((state) => ({
      uploadedFiles: {
        ...state.uploadedFiles,
        [localId]: uploadedFile,
      },
    })),

  appendUploadedFiles: (uploadedFiles) =>
    set((state) => ({
      uploadedFiles: {
        ...state.uploadedFiles,
        ...uploadedFiles,
      },
    })),

  setProgressInfo: (fileId, value) => {
    const progressInfos = get().progressInfos;

    set({
      progressInfos: {
        ...progressInfos,
        [fileId]: value,
      },
    });
  },

  setProgressInfos: (newProgressInfos) => {
    const progressInfos = get().progressInfos;

    set({
      progressInfos: {
        ...progressInfos,
        ...newProgressInfos,
      },
    });
  },

  setUploadLog: (fileId, log) =>
    set((state) => ({
      uploadLogs: {
        ...state.uploadLogs,
        [fileId]: log,
      },
    })),

  setUploadLogs: (newLogs) =>
    set((state) => ({
      uploadLogs: {
        ...state.uploadLogs,
        ...newLogs,
      },
    })),

  uploadFile: async (datasetId, file) => {
    const setProgressInfo = get().setProgressInfo;
    const setUploadLog = get().setUploadLog;
    const appendUploadedFile = get().appendUploadedFile;

    DataInstanceService.upload(file, datasetId, (event) => {
      setProgressInfo(file.id, Math.round((100 * event.loaded) / event.total));
    })
      .then((uploadedFile) => {
        setUploadLog(file.id, {
          success: true,
          message: "Success",
        });
        appendUploadedFile(file.id, uploadedFile);
      })
      .catch((error) => {
        setUploadLog(file.id, {
          success: false,
          message: getLodash(error, "data.errors", "upload error"),
        });
      });
  },

  uploadMultipleFiles: async (datasetId, files) => {
    const setProgressInfos = get().setProgressInfos;
    const setUploadLogs = get().setUploadLogs;
    const appendUploadedFiles = get().appendUploadedFiles;
    // Update logs all files
    const newLogs = {};
    files.forEach((file) => {
      newLogs[file.id] = {
        success: false,
        message: "Uploading",
      };
    });
    setUploadLogs(newLogs);
    // Split files to 100 files each batch
    // Each batch will handle sequentially, so that we can wait for response
    const batch_size = 5;
    const batches = _.chunk(files, batch_size);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const uploadedFiles = await DataInstanceService.uploadMultipleFiles(
        datasetId,
        batch,
        (event) => {
          // Update progress all files
          const newProgressInfos = {};
          batch.forEach((file) => {
            newProgressInfos[file.id] = Math.round(
              (100 * event.loaded) / event.total
            );
          });
          setProgressInfos(newProgressInfos);
        }
      );

      // Create update logs for file that not uploaded
      const notUploadedFiles = filter(batch, (file) => {
        return !uploadedFiles.find((uploadedFile) => {
          return uploadedFile.id === file.id;
        });
      });

      let failedUploadLogs = {};
      notUploadedFiles.forEach((file) => {
        failedUploadLogs[file.id] = {
          success: false,
          message: "Upload error",
        };
      });
      setUploadLogs(failedUploadLogs);
            
      // Update upload logs for file that uploaded
      let newLogs = {};
      uploadedFiles.forEach((uploadedFile) => {
        newLogs[uploadedFile.id] = {
          success: true,
          message: "Success",
        };
      });
      setUploadLogs(newLogs);
      const newUploadedFiles = {};
      uploadedFiles.forEach((uploadedFile) => {
        newUploadedFiles[uploadedFile.id] = uploadedFile;
      });
      appendUploadedFiles(newUploadedFiles);
    }
  },
}));

export default useUploadDatasetStore;
