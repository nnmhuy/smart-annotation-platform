import React from 'react'
import { Group, Path } from 'react-konva'
import Flatten from '@flatten-js/core'
import { cloneDeep } from 'lodash'

import PolygonPath from './PolygonPath'
import PolygonMidPoints from './PolygonMidPoints'
import PolygonMainPoints from './PolygonMainPoints'

import { MIN_DIST_TO_START_POINT } from '../../../constants'

const Polygon = (props) => {
  const {
    polygon, currentMousePos,
    isDrawing, isCutting, isEditing, isDraggingViewport,
    isSelected, onSelect,
    setIsMouseOverPolygonStart,
    onChange,
    setCuttingPolygon,
    isValidProcessingPolygon, setIsValidProcessingPolygon,
  } = props

  const groupRef = React.useRef(null)
  const [draggingPointKey, setDraggingPointKey] = React.useState(null)
  const [isDraggingPolygon, setIsDraggingPolygon] = React.useState(false)
  
  const { id, polys, ...others } = polygon
  const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1

  const [toDrawPolys, setToDrawPolys] = React.useState(polys)

  React.useEffect(() => {
    // check if adding currentMousePos to the rendering polygon
    // handle click cut inside polygon checking
    // handle drawing polygon self-intersection checking


    // handle click cut inside polygon checking
    if (isCutting) {
      const cuttingPoly = Flatten.polygon()
      let cutPolyPoints = cloneDeep(polys[polys.length - 1])

      const addMousePos = [currentMousePos.x, currentMousePos.y]
      if (cutPolyPoints[0] && Flatten.point(addMousePos).distanceTo(Flatten.point(cutPolyPoints[0]))[0] > MIN_DIST_TO_START_POINT) {
        cutPolyPoints.push(addMousePos)
      }

      cuttingPoly.addFace(cutPolyPoints)

      let hasIntersection = false
      polys.forEach((points, polyIndex) => {
        if (polyIndex === polys.length - 1) {
          return
        }

        const currentPoly = Flatten.polygon()
        currentPoly.addFace(points)

        const intersectionPoints = cuttingPoly.intersect(currentPoly)
        hasIntersection = hasIntersection || (intersectionPoints.length > 0)
      })

      setIsValidProcessingPolygon(!hasIntersection && cuttingPoly.isValid())
    }

    // handle drawing polygon self-intersection checking
    if (isDrawing) {
      const drawingPoly = Flatten.polygon()

      let drawingPolyPoints = cloneDeep(polys[0])
      const addMousePos = [currentMousePos.x, currentMousePos.y]
      if (drawingPolyPoints[0] && Flatten.point(addMousePos).distanceTo(Flatten.point(drawingPolyPoints[0]))[0] > MIN_DIST_TO_START_POINT) {
        drawingPolyPoints.push(addMousePos)
      }

      drawingPoly.addFace(drawingPolyPoints)
      setIsValidProcessingPolygon(drawingPoly.isValid())
    }


    let toDrawPolys = polys.map((points, polyIndex) => {
      const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

      const addMousePos = [currentMousePos.x, currentMousePos.y]
      let mainPoints = points
      if (isActivePoly
        && isValidProcessingPolygon
        && points[0]
        && Flatten.point(addMousePos).distanceTo(Flatten.point(points[0]))[0] > MIN_DIST_TO_START_POINT
      ) {
        mainPoints = mainPoints.concat([addMousePos])
      }

      return mainPoints
    })

    let fullPolygon = Flatten.polygon()
    toDrawPolys.forEach((points, polyIndex) => {
      if (points.length < 3) {
        return
      }
      let newFace = fullPolygon.addFace(points)
      if ((polyIndex === 0 && newFace.orientation() === Flatten.ORIENTATION.CCW) ||
        (polyIndex !== 0 && newFace.orientation() === Flatten.ORIENTATION.CW)
      ) {
        newFace.reverse()
      }
    })
  }, [currentMousePos])


  const onDragPolygonStart = () => {
    setIsDraggingPolygon(true)
  }

  const onDragPolygonMove = event => {
    const dX = event.target.x()
    const dY = event.target.y()
    onChange({
      ...polygon,
      x: dX,
      y: dY
    })
  }

  const onDragPolygonEnd = () => {
    const dX = polygon.x
    const dY = polygon.y

    onChange({
      ...polygon,
      polys: polys.map(poly => poly.map(p => [p[0] + dX, p[1] + dY])),
      x: 0,
      y: 0
    })

    setIsDraggingPolygon(false)
  }

  return (
    <Group
      ref={groupRef}
    >
      <PolygonPath
        polygon={{
          ...polygon,
          polys: toDrawPolys,
        }}
        onDragPolygonStart={onDragPolygonStart}
        onDragPolygonMove={onDragPolygonMove}
        onDragPolygonEnd={onDragPolygonEnd}
      />
      {(!isDraggingPolygon && (isDrawing || isSelected)) &&
        <PolygonMainPoints
          isDrawing={isDrawing}
          isCutting={isCutting}
          isEditing={isEditing}
          isDraggingViewport={isDraggingViewport}
          setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
          scale={scale}
          polygon={polygon}
          onChange={onChange}
        />
      }
      {isEditing && 
        <PolygonMidPoints
          isDraggingViewport={isDraggingViewport}
          polygon={polygon}
          scale={scale}
          draggingPointKey={draggingPointKey}
          setDraggingPointKey={setDraggingPointKey}
          onChange={onChange}
        />
      }
    </Group>
  )
}

export default Polygon