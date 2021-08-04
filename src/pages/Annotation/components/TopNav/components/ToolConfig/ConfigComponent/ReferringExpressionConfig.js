import React, { useState, useEffect, useRef } from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { find, get, debounce } from 'lodash'

import EventCenter from '../../../../../EventCenter'
import { useAnnotationStore } from '../../../../../stores/index'

import ToolConfigButton from '../components/ToolConfigButton'

import { ReactComponent as SendIcon } from '../../../../../../../static/images/icons/ConfigIcon/send.svg'

import { EVENT_TYPES } from '../../../../../constants'

const useStyles = makeStyles(theme => ({
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
    alignItems: 'center',
  },
  referringExpressionInput: {
    width: 500,
    '& label.MuiFormLabel-root': {
      color: theme.palette.secondary.light
    },
    '& label.Mui-focused': {
      color: theme.palette.secondary.main
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.secondary.light
      },
    },
  },
  textFieldInput: {
    color: theme.palette.primary.contrastText
  }
}))


const ReferringExpressionConfig = (props) => {
  const classes = useStyles()
  const inputRef = useRef(null)

  const [isPredicting, setIsPredicting] = useState(false)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const annotationObjects = useAnnotationStore(state => state.annotationObjects)
  useEffect(() => {
    const currentAnnotationObject = find(annotationObjects, { id: selectedObjectId })
    if (inputRef?.current) {
      handleFocusTextInput()
      inputRef.current.value = get(currentAnnotationObject, 'attributes.referringExpression', '')
    }
  }, [selectedObjectId])

  const handleFocusTextInput = () => {
    inputRef.current.focus()
  }

  const handlePredictStart = () => {
    inputRef.current.blur()
    setIsPredicting(true)
  }

  const handlePredictEnd = () => {
    setIsPredicting(false)
  }

  const handleTextChange = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.REFERRING_EXPRESSION_CHANGE)(e.target.value)
  }

  const debouncedHandleTextChange = debounce(handleTextChange, 500)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)(inputRef?.current?.value)
    }
  }


  useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT)
        .subscribe({ next: (e) => handleFocusTextInput(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)
        .subscribe({ next: (e) => handlePredictStart(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_FINISH]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_FINISH)
        .subscribe({ next: (e) => handlePredictEnd(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR)
        .subscribe({ next: (e) => handlePredictEnd(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <TextField
          inputRef={inputRef}
          autoFocus
          className={classes.referringExpressionInput}
          label="Referring expression" 
          variant="outlined"
          color="secondary"
          size="small"
          onChange={debouncedHandleTextChange}
          onKeyPress={handleKeyPress}
          disabled={isPredicting}
          InputProps={{
            className: classes.textFieldInput
          }}
        />
        <ToolConfigButton
          name={'Run referring expression'}
          handleClick={() => EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)(inputRef?.current?.value)}
          component={<SendIcon />}
          isLoading={isPredicting}
          disabled={isPredicting}
        />
      </div>
    </div>
  )
}

export default ReferringExpressionConfig