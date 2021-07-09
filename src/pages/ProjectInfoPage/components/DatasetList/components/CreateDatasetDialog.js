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

import DatasetClass from '../../../../../classes/DatasetClass'

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
]

const CreateDatasetDialog = (props) => {
  const { 
    open, setOpen,
    errors,
    handleSubmit,
  } = props

  const handleClose = () => {
    setOpen(false)
  }

  const generalError = get(errors, 'error', '')

  return (
    <Dialog 
      open={open} 
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
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}


const CreateDatasetForm = withFormik({
  mapPropsToValues: () => ({ name: '', description: '' }),

  validationSchema: Yup.object().shape({
    name: Yup.string().required()
  }),

  handleSubmit: async (values, { props: { projectId, handleCreate, setOpen }, setSubmitting, setErrors }) => {
    setSubmitting(true)
    const newDataset = new DatasetClass('', values.name, projectId, { description: values.description })

    try {
      const datasetResponse = await newDataset.applyCreateDataset()
      handleCreate(DatasetClass.constructorFromServerData(datasetResponse.data))
      setOpen(false)
    } catch (error) {
      const errMessage = get(error, 'data.errors.json[0]', '')
      setErrors({ error: errMessage })
    }
    setSubmitting(false)
  }
})(CreateDatasetDialog);


export default CreateDatasetForm