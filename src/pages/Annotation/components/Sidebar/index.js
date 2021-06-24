import React from 'react'
import { makeStyles } from '@material-ui/core'
import { filter } from 'lodash'

import LabelList from './components/LabelList'

import { theme } from '../../../../theme'


const useStyles = makeStyles((props) => ({
  sideBarWrapper: {
    // width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    backgroundColor: theme.light.primaryColor,
    padding: 20,
    overflowY: 'scroll',
  },
}))

const SideBar = (props) => {
  const { useStore, eventCenter } = props

  const imageId = useStore(state => state.imageId)
  const annotations = useStore(state => state.annotations)
  const labels = useStore(state => state.labels)

  const classes = useStyles()
  return (
    <div className={classes.sideBarWrapper}>
      {
        labels.map(value => {
          return <LabelList
            useStore={useStore}
            key={`label-${value.id}-${value.label}`}
            annotations={filter(annotations, { imageId, labelId: value.id })}
            classLabel={value}
          />
        })
      }
    </div>
  )
}

export default SideBar