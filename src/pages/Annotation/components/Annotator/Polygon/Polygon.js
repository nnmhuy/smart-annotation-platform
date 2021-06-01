import React from 'react'
import { Group } from 'react-konva'
import Flatten from '@flatten-js/core'

import PolygonPath from './PolygonPath'
import PolygonMidPoints from './PolygonMidPoints'
import PolygonMainPoints from './PolygonMainPoints'

import { MIN_DIST_TO_START_POINT } from '../../../constants'
import checkValidPolys from '../../../utils/checkValidPolys'

const Polygon = (props) => {
  const {
    polygon, currentMousePos,
    isDrawing, isCutting, isEditing, isDraggingViewport,
    isSelected, onSelect,
    setIsMouseOverPolygonStart,
    onChange,
    setIsValidProcessingPolygon,
  } = props

  const groupRef = React.useRef(null)
  const [draggingPointKey, setDraggingPointKey] = React.useState(null)
  const [isDraggingPolygon, setIsDraggingPolygon] = React.useState(false)
  
  const { id, polys } = polygon
  const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1

  const [toDrawPolys, setToDrawPolys] = React.useState(polys)

  React.useEffect(() => {
    // check if adding currentMousePos to the rendering polygon
    //  handle click cut inside polygon checking
    //  handle drawing polygon self-intersection checking
    //  check min dist to start point
    //  check intersecting faces

    if (isCutting || isDrawing || isEditing) {
      const addMousePos = [currentMousePos.x, currentMousePos.y]

      let interactingPolys = polys.map((points, polyIndex) => {
        const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

        let mainPoints = points
        if (isActivePoly
          && 
          (!points[0] || Flatten.point(addMousePos).distanceTo(Flatten.point(points[0]))[0] > MIN_DIST_TO_START_POINT)
        ) {
          mainPoints = mainPoints.concat([addMousePos])
        }

        return mainPoints
      })

      if (checkValidPolys(interactingPolys)) {
        setToDrawPolys(interactingPolys)
        setIsValidProcessingPolygon(true)
      } else {
        setToDrawPolys(polys)
        setIsValidProcessingPolygon(false)
      }
      
    } else {
      setToDrawPolys(polys)
    }
  }, [polys, currentMousePos, isCutting, isDrawing, isEditing]) // eslint-disable-line


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
      id={id}
      ref={groupRef}
    >
      <PolygonPath
        polygon={{
          ...polygon,
          polys: toDrawPolys,
        }}
        isEditing={isEditing}
        isDraggingViewport={isDraggingViewport}
        onSelect={onSelect}
        onDragPolygonStart={onDragPolygonStart}
        onDragPolygonMove={onDragPolygonMove}
        onDragPolygonEnd={onDragPolygonEnd}
        scale={scale}
      />
      {(!isDraggingPolygon && (isDrawing || isSelected)) &&
        <PolygonMainPoints
          isDrawing={isDrawing}
          isCutting={isCutting}
          isEditing={isEditing}
          isDraggingViewport={isDraggingViewport}
          setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
          scale={scale}
          polygon={{
            ...polygon,
            polys: toDrawPolys,
          }}
          onChange={onChange}
          draggingPointKey={draggingPointKey}
          setDraggingPointKey={setDraggingPointKey}
        />
      }
      {(!isDraggingPolygon && isEditing) &&
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