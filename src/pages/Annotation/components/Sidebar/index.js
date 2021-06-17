import React from 'react'
import { makeStyles } from '@material-ui/core'

import LabelList from './components/LabelList'

import { theme } from '../../../../theme'


const useStyles = makeStyles((props) => ({
  sideBarWrapper: {
    // width: '100%',
    height: '100%',
    backgroundColor: theme.light.primaryColor,
    padding: 20,
  },
}))

const SideBar = (props) => {
  const { useStore, eventCenter } = props

  const annotations = useStore(state => state.annotations)
  const labels = useStore(state => state.labels)

  const classes = useStyles()
  return (
    <div className={classes.sideBarWrapper}>
      <LabelList
        key={`label-0-unknown`}
        annotations={annotations.filter(anno => anno.labelId === '')}
        classLabel={'Unknown'}
      />
      {
        labels.map(value => {
          return <LabelList
            key={`label-${value.id}-${value.label}`}
            annotations={annotations.filter(anno => anno.labelId === value.id)}
            classLabel={value.label}
          />
        })
      }
    </div>
  )
}

export default SideBar