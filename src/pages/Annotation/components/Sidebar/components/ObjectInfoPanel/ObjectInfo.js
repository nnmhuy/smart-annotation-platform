import React from 'react'


const ObjectInfo = (props) => {
  const { annotationObject } = props
  return (
    <div>{annotationObject.id}</div>
  )
}

export default ObjectInfo