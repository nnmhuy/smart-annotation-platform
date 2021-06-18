import React from 'react'
import Flatten from '@flatten-js/core'
import { Path } from 'react-konva'

const PolygonPath = (props) => {
  const { 
    polygon,
    scale,
    isEditing, isDraggingViewport,
    onSelect,
    onDragPolygonStart, onDragPolygonMove, onDragPolygonEnd,
  } = props

  const { id, polys, ...others } = polygon

  const pathRef = React.useRef(null)
  console.log(polys)
  React.useEffect(() => {
    let fullPolygon = Flatten.polygon()
    polys.forEach((points, polyIndex) => {
      if (points.length <= 1) {
        return
      }
      let newFace = fullPolygon.addFace(points)
      if ((polyIndex === 0 && newFace.orientation() === Flatten.ORIENTATION.CCW) ||
        (polyIndex !== 0 && newFace.orientation() === Flatten.ORIENTATION.CW)
      ) {
        newFace.reverse()
      }
    })
    
    const polygonSvgData = fullPolygon.svg()
    const toNodes = html => new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]
    const svgPathNode = toNodes(polygonSvgData)

    if (svgPathNode) {
      const path = pathRef.current
      path.data(svgPathNode.getAttribute("d"))
      console.log(svgPathNode.getAttribute("d"))

      path.setAttrs({
        fillRule: "evenodd",
        "fill-rule": "evenodd"
      })
    }
  }, [polys])



  return (
    <Path
      ref={pathRef}
      id={id}
      onClick={onSelect}
      onTap={onSelect}
      draggable={isEditing}
      onDragStart={onDragPolygonStart}
      onDragMove={onDragPolygonMove}
      onDragEnd={onDragPolygonEnd}
      strokeWidth={others.strokeWidth / scale}
      hitFunc={isDraggingViewport && function () {
        // disable hitFunc while dragging viewport
      }}
      {...others}
    />
  )
}

export default PolygonPath