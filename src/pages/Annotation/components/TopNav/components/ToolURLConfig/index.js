import React from 'react';
import { Formik, Form, Field, useFormik } from 'formik';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { MODEL_SERVER_URL_KEY } from '../../../../constants'

const useStyles = makeStyles((theme) => ({
  modelWrapper: {
    display: 'flex',
    width: '100%',
    margin: 'auto',
    justifyContent: 'center'
  },
  textField: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%'
  }
}))

const configServerUrl = [
  {
    label: 'S2M Server URL',
    value: MODEL_SERVER_URL_KEY.S2M
  },
  {
    label: 'CMPC Server URL',
    value: MODEL_SERVER_URL_KEY.CMPC
  },
  {
    label: 'Rule-based Server URL',
    value: MODEL_SERVER_URL_KEY.REFEX_RULE
  },
  {
    label: 'Mask Propagation Server URL',
    value: MODEL_SERVER_URL_KEY.MASK_PROP
  }

]


const ToolURLConfig = (props) => {
  const classes = useStyles()
  let initialValues = {}
  Object.keys(MODEL_SERVER_URL_KEY).forEach((key) => {
    const server_key = MODEL_SERVER_URL_KEY[key] || ''
    initialValues[server_key] = localStorage.getItem(server_key) || ''
  })
  console.log(initialValues)
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      Object.keys(values).forEach((key) => {
        localStorage.setItem(key, values[key])
      })
    }
  })
  return (
    <div className={classes.modelWrapper}>
      <form onSubmit={formik.handleSubmit}>
        {configServerUrl.map(serverInfo => (
          <TextField
            className={classes.textField}
            key={serverInfo.value}
            name={serverInfo.value}
            label={serverInfo.label}
            value={formik.values[serverInfo.value]}
            onChange={formik.handleChange}
          />
        ))}
        <br />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.btn}
        >
          Update Server URL
        </Button>
      </form>
    </div>
  )
}

export default ToolURLConfig