import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ALL_MODES } from '../../constants'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  mode: {

  },
  activeMode: {
    background: 'green'
  }
}))

const Toolbox = (props) => {
  const classes = useStyles()
  const { activeMode, setMode } = props
  return (
    <div>
      {
        ALL_MODES.map(({category, modes}) => (
          <div key={category}>
            <div>
              {category}
            </div>
            {
              modes.map(({label, mode}) => {
                return (
                  <button 
                    key={label} 
                    className={clsx(classes.mode, mode === activeMode && classes.activeMode)}
                    onClick={() => setMode(mode)}
                  >
                    {label}
                  </button>
                )
              })
            }
          </div>
        ))
      }
    </div>
  )
}

export default Toolbox