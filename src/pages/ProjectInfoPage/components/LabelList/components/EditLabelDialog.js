import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { get, set, cloneDeep } from 'lodash'
import FormHelperText from "@material-ui/core/FormHelperText";
import { withFormik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../../../../../components/TextField'

import LabelClass from '../../../../../classes/LabelClass'

import { ColorEditInput } from './ColorCell'


const fields = [
  {
    name: 'label',
    label: 'Label name',
    placeholder: 'new label',
    variant: 'outlined',
    required: true,
    fullWidth: true,
    autoFocus: true,
    margin: 'dense',
    component: TextField
  },
  {
    name: 'annotationProperties.fill',
    label: 'Fill color',
    variant: 'outlined',
    required: true,
    fullWidth: true,
    margin: 'dense',
    component: ColorEditInput
  },
  {
    name: 'annotationProperties.stroke',
    label: 'Stroke color',
    variant: 'outlined',
    required: true,
    fullWidth: true,
    margin: 'dense',
    component: ColorEditInput
  },
]

const EditLabelDialog = (props) => {
  const { 
    open, setOpen, handleSave, 
    projectId, label,
    values, setFieldValue,
    errors, isSubmitting,
    setSubmitting, setErrors
  } = props

  React.useEffect(() => {
    fields.forEach(({ name }) => {
      setFieldValue(name, get(label, name, ''))
    })
  }, [label, setFieldValue])

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = async () => {
    let data = cloneDeep(values)
    Object.keys(data).forEach(key => {
      if (errors[key]) {
        return
      }
    })

    const newLabel = new LabelClass(
      label.id, 
      values["label"],
      projectId,
      {},
      {
        fill: get(values, 'annotationProperties.fill', ''),
        stroke: get(values, 'annotationProperties.stroke', '')
      }
    )

    try {
      await handleSave(newLabel)
    } catch (error) {
      const errMessage = get(error, 'data.errors.json.label', '')
      setErrors({ error: errMessage })
    }
    setSubmitting(false)
  }

  const generalError = get(errors, 'error', '')

  return (
    <Dialog 
      open={open || isSubmitting} 
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        {label.id ? "Edit label" : "Create new label"}
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

const LabelForm = withFormik({
  mapPropsToValues: ({ label }) => ({
    label: get(label, 'label', ''),
    annotationProperties: {
      fill: get(label, 'annotationProperties.stroke', '#00FF00'),
      stroke: get(label, 'annotationProperties.stroke', '#000000'),
    }
  }),

  validationSchema: Yup.object().shape({
    label: Yup.string().required(),
    annotationProperties: Yup.object().shape({
      fill: Yup.string().required(),
      stroke: Yup.string().required(),
    })
  }),
})(EditLabelDialog);

export default LabelForm