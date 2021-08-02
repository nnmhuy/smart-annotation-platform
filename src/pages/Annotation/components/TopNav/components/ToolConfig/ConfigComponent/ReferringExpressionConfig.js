import React, { useEffect, useRef } from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

import EventCenter from '../../../../../EventCenter'

// import ToolConfigButton from '../components/ToolConfigButton'

// import { ReactComponent as DeleteIcon } from '../../../../../../../static/images/icons/ConfigIcon/delete.svg'

import { EVENT_TYPES } from '../../../../../constants'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: '80%',
  },
  optionContainer: {
    marginLeft: 10,
    marginRight: 10,
    display: 'flex',
  },
  referringExpressionInput: {
    width: 500
  }
}))


const ReferringExpressionConfig = (props) => {
  const classes = useStyles()

  const inputRef = useRef(null)

  useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT)
        .subscribe({ next: (e) => handleFocusTextInput(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)
        .subscribe({ next: (e) => handlePredictStart(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  const handleFocusTextInput = () => {
    inputRef.current.focus()
  }

  const handlePredictStart = () => {
    inputRef.current.blur()
  }

  const handleTextChange = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.REFERRING_EXPRESSION_CHANGE)(e.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)()
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <TextField
          inputRef={inputRef}
          autoFocus
          className={classes.referringExpressionInput}
          label="Referring expression" 
          variant="outlined"
          size="small"
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  )
}

export default ReferringExpressionConfig