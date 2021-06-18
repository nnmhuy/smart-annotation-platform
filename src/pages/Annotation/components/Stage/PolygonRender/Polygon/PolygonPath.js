import React from 'react'
import Flatten from '@flatten-js/core'
import { Path } from 'react-konva'

const PolygonPath = (props) => {
  const {
    id,
    polygon,
    scale,
  } = props

  // const { id, polys, ...others } = polygon
  const polys = polygon.polys
  const { ...others } = polygon

  const pathRef = React.useRef(null)

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
      strokeWidth={others.strokeWidth / scale}
      // hitFunc={isDraggingViewport && function () {
      //   // disable hitFunc while dragging viewport
      // }}
      {...others}
    />
  )
}

export default PolygonPath