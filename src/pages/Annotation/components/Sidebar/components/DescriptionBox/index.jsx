import { Box, TextField } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { useDatasetStore } from 'pages/Annotation/stores'
import React from 'react'
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  input: {
    background: "rgb(232, 241, 250)",
    borderRadius: 10
  }
}));

const DescriptionBox = () => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstances = useDatasetStore(state => state.dataInstances)
  const setDescriptionDataInstance = useDatasetStore(state => state.setDescriptionDataInstance)

  const classes = useStyles()

  const handleChange = (event) => {
    setDescriptionDataInstance(instanceId, event.target.value)
  }

  const description = dataInstances.find(dataInstance => dataInstance.id === instanceId)?.description || ''
  return (
    <Box sx={{backgroundColor: 'white', width: '100%', marginTop: 20, borderRadius: 0}}>
      <TextField
        id="data-description"
        label="Description"
        variant='filled'
        InputProps={{ className: classes.input }}
        value={description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
      />
    </Box>
  )
}

export default DescriptionBox