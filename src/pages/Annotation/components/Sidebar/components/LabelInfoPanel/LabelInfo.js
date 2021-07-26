import React from 'react'


const LabelInfo = (props) => {
  const { labelObject } = props
  return (
    <div>{labelObject.label}</div>
  )
}

export default LabelInfo