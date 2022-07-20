import { Button, Grid, makeStyles, styled } from '@material-ui/core'
import React from 'react'

import { useDatasetStore } from '../../../../stores/index'
import { ENUM_ANNOTATE_STATUS } from '../../../../../../constants'

const useStyles = makeStyles(theme => ({
  container: {
    boxSizing: 'border-box',
    width: '100%'
  },
}))

const CustomButton = styled(Button)({
  marginTop: 20,
  width: '100%',
})

const UpdateStatusButtonPanel = () => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const updateAnnotateStatusDataInstance = useDatasetStore(state => state.updateAnnotateStatusDataInstance)
  const classes = useStyles()
  return (
    <div>
      {instanceId && <Grid container direction='column' className={classes.container}>
        <Grid item>
          <CustomButton variant="contained" color='primary' onClick={() => updateAnnotateStatusDataInstance(instanceId, ENUM_ANNOTATE_STATUS.FINSIHED)}>
            Mark as Finished
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton variant="contained" color='inherit' onClick={() => updateAnnotateStatusDataInstance(instanceId, ENUM_ANNOTATE_STATUS.UNFINISHED)}>
            Mark as Unfinished
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton variant="contained" color='secondary' onClick={() => updateAnnotateStatusDataInstance(instanceId, ENUM_ANNOTATE_STATUS.UNCERTAIN)}>
            Mark as Uncertain
          </CustomButton>
        </Grid>
      </Grid>}
    </div>
  )
}

export default UpdateStatusButtonPanel