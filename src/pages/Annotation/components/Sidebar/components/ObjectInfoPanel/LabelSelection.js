import React from 'react'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { get } from 'lodash'

import { DEFAULT_ANNOTATION_ATTRS } from '../../../../constants'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
  },
  colorIndicator: {
    display: 'inline-block',
    height: 10,
    width: 10,
    marginRight: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
  }
}))

const LabelSelection = (props) => {
  const classes = useStyles()
  const { labels, labelId, handleChangeLabel } = props

  return (
    <Autocomplete
      className={classes.root}
      options={labels}
      selectOnFocus
      clearOnBlur
      getOptionLabel={(option) => option.label || ''}
      getOptionSelected={(option) => (option.id === labelId)}
      renderOption={(option) => (
        <React.Fragment>
          <span
            className={classes.colorIndicator}
            style={{
              background: get(option, 'annotationProperties.fill', DEFAULT_ANNOTATION_ATTRS.fill),
              borderColor: get(option, 'annotationProperties.stroke', DEFAULT_ANNOTATION_ATTRS.stroke),
            }}
          />
          {option.label}
        </React.Fragment>
      )}
      value={labelId}
      onChange={(event, newValue) => handleChangeLabel(newValue)}
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a label"
          variant="outlined"
          size="small"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
        />
      )}
    />
  )
}

export default LabelSelection