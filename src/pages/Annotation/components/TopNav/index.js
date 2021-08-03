import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import { useParams } from 'react-router'

import DataInfo from './components/DataInfo/index'
import ToolConfig from './components/ToolConfig/index'
import useQuery from '../../../../utils/useQuery'

import { theme } from '../../../../theme'

const useStyles = makeStyles(() => ({
  topNavWrapper: {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    background: theme.light.forthColor
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  centerSection: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
}))

// TODO: keyboard instruction
const TopNav = (props) => {
  const classes = useStyles()
  const { datasetId } = useParams()
  const query = useQuery()
  const page = JSON.parse(query.get("page") || 1)

  return (
    <div className={classes.topNavWrapper}>
      <div className={classes.leftSection}>
        <DataInfo />
      </div>
      <div className={classes.centerSection}>
        <ToolConfig />
      </div>
      <div className={classes.rightSection}>
        <IconButton
          href={`/datasets/dataset=${datasetId}?page=${page}`}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default TopNav