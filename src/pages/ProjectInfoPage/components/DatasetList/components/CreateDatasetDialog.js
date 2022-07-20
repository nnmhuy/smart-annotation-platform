import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from "@material-ui/core/FormHelperText";
import { withFormik, Field } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash'

import TextField from '../../../../../components/TextField'
import SelectField from '../../../../../components/SelectField'


import DatasetService from '../../../../../services/DatasetService'

import { DATASET_DATATYPE } from 'constants/index'

const fields = [
  {
    name: 'name',
    label: 'Dataset name',
    helperText: 'Must be unique in same project',
    variant: 'standard',
    required: true,
    fullWidth: true,
    component: TextField
  },
  {
    name: 'description',
    label: 'Description',
    variant: 'standard',
    fullWidth: true,
    component: TextField
  },
  {
    name: 'datatype',
    label: 'Datatype',
    options:[
      { value: DATASET_DATATYPE.IMAGE, label: 'Image' },
      { value: DATASET_DATATYPE.VIDEO, label: 'Video' },
    ],
    required: true,
    fullWidth: true,
    helperText: `Can't change after creation`,
    component: SelectField,
  }
]

const CreateDatasetDialog = (props) => {
  const { 
    open, setOpen,
    errors,
    handleSubmit, isSubmitting
  } = props

  const handleClose = () => {
    setOpen(false)
  }

  const generalError = get(errors, 'error', '')

  return (
    <Dialog 
      open={open || isSubmitting}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">
        Create dataset
        {generalError &&
          <FormHelperText error>
            {generalError}
          </FormHelperText>
        }
      </DialogTitle>
      <DialogContent>
        {
          fields.map(field => {
            return (
              <Field
                key={field.name}
                name={field.name}
                {...field}
              />
            )
          })
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isSubmitting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}


const CreateDatasetForm = withFormik({
  mapPropsToValues: () => ({ name: '', description: '' }),

  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    datatype: Yup.string().required().oneOf([DATASET_DATATYPE.IMAGE, DATASET_DATATYPE.VIDEO]),
    description: Yup.string()
  }),

  handleSubmit: async (values, { props: { projectId, handleCreate, setOpen }, setSubmitting, setErrors }) => {
    setSubmitting(true)
    try {
      const newDataset = await DatasetService.createDataset({
        projectId,
        name: values.name,
        datatype: values.datatype,
        description: values.description,
      })
      handleCreate(newDataset)
      setOpen(false)
    } catch (error) {
      const errMessage = get(error, 'data.errors.json.dataset', '')
      setErrors({ error: errMessage })
    }
    setSubmitting(false)
  }
})(CreateDatasetDialog);


export default CreateDatasetForm