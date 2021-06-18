import React, { useEffect, useState } from 'react'
import { Circle } from 'react-konva'
import { cloneDeep } from 'lodash'

import checkValidPolys from '../../../utils/checkValidPolys'

const PolygonMidPoints = (props) => {
  const { 
    isDraggingViewport,
    polygon,
    scale,
    draggingPointKey, setDraggingPointKey,
    onChange,
  } = props
  const [polysMidPoints, setPolysMidPoints] = useState([])
  const [lastValidMidPoint, setLastValidMidPoint] = useState(null)

  const { id, polys, x: dX, y: dY } = polygon

  const calculateMidPoints = () => {
    setPolysMidPoints(polys.map(poly => poly.map((curPoint, index) => {
      const nextPoint = poly[(index + 1) % poly.length]
      return [
        (curPoint[0] + nextPoint[0]) / 2,
        (curPoint[1] + nextPoint[1]) / 2,
      ]
    })))
  }

  useEffect(() => {
    calculateMidPoints()
  }, [polys]) // eslint-disable-line

  const handleStartDraggingMidPoint = (event) => {
    const key = event.target.key;

    setDraggingPointKey(key)
  }

  const getNewPolysAfterDraggingMidPoint = (polys, polyIndex, pointIndex, pos) => {
    const newPolys = cloneDeep(polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex + 1), pos, ...poly.slice(pointIndex + 1)]
      }
    })

    return newPolys
  }

  const handleMoveDraggingMidPoint = (event, polyIndex, pointIndex) => {
    const key = event.target.key;
    if (key !== draggingPointKey) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];

    const newPolys = getNewPolysAfterDraggingMidPoint(polys, polyIndex, pointIndex, pos)
    if (checkValidPolys(newPolys)) {
      setLastValidMidPoint({ x: pos[0], y: pos[1] })
      setPolysMidPoints(polysMidPoints.map((poly, index) => {
        if (index !== polyIndex) {
          return poly
        } else {
          return [...poly.slice(0, pointIndex), pos, ...poly.slice(pointIndex + 1)]
        }
      }))
    } else {
      if (lastValidMidPoint) {
        event.target.absolutePosition(lastValidMidPoint)
      }
    }
  }

  const handleEndDraggingMidPoint = (event, polyIndex, pointIndex) => {
    const pos = [event.target.attrs.x, event.target.attrs.y];

    const newPolys = getNewPolysAfterDraggingMidPoint(polys, polyIndex, pointIndex, pos)

    if (checkValidPolys(newPolys)) {
      onChange({
        ...polygon,
        polys: polys.map((poly, index) => {
          if (index !== polyIndex) {
            return poly
          } else {
            return [...poly.slice(0, pointIndex + 1), pos, ...poly.slice(pointIndex + 1)]
          }
        })
      })
    } else {
      calculateMidPoints()
    }
    setDraggingPointKey(null)
    setLastValidMidPoint(null)
  }

  return (
    <>
      {polysMidPoints.map((midPoints, polyIndex) => {
        return (
          <> 
            {midPoints.map((point, pointIndex) => {
              const x = point[0] + dX;
              const y = point[1] + dY;
              return (
                <Circle
                  key={`poly-midpoint-${id}-${polyIndex}-${pointIndex}`}
                  x={x}
                  y={y}
                  radius={5 / scale}
                  fill="white"
                  stroke="black"
                  opacity={0.8}
                  strokeWidth={2 / scale}
                  onDragStart={handleStartDraggingMidPoint}
                  onDragMove={(e) => handleMoveDraggingMidPoint(e, polyIndex, pointIndex)}
                  onDragEnd={(e) => handleEndDraggingMidPoint(e, polyIndex, pointIndex)}
                  draggable
                  hitFunc={isDraggingViewport && function () {
                    // disable hitFunc while dragging viewport
                  }}
                />
              );
            })}
          </>
        )
      })}
    </>
  )
}

export default PolygonMidPoints