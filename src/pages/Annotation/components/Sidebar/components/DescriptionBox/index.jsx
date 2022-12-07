import { Box, TextField } from '@material-ui/core'
import { useDatasetStore } from 'pages/Annotation/stores'
import React from 'react'
import { useState } from 'react'

const DescriptionBox = (props) => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(state => state.getDataInstance)
  const setDescriptionDataInstance = useDatasetStore(state => state.setDescriptionDataInstance)
  const handleChange = (event) => {
    setDescriptionDataInstance(instanceId, event.target.value)
  }
  return (
    <Box>
      <TextField
        id="data-description"
        value={dataInstance.description || ''}
        handleChange={handleChange}
      />
    </Box>
  )
}

export default DescriptionBox